import React, { Component } from "react";
import UserManager from "security/UserManager";
import axios from "axios";

import ElectionHomeRouteView from "routes/dashboard-election/dashboard-election-home/ElectionHomeRouteView";
import { initialAjaxAlertState, fireAjaxErrorAlert } from "utils/error";
import ErrorAlert from "components/error-alert";

class ElectionHomeRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      election: null,
      string_dates: "",
      created_by: "",
      componentIsLoading: true,
      finalizing: false,
      fireFinalizeModal: false,
      fireDeleteModal: false,
      fireDeleteSuccessModal: false,
      fireFinalizeSuccessModal: false,
      fireFinalizeErrorModal: false,
      electionIsDeleting: false,
      showNoElectionModal: true,
      ...initialAjaxAlertState,
    };
    this._userManager = new UserManager(this.props.user);
  }

  closeNoElectionModal = () => {
    this.setState({ showNoElectionModal: false });
  };

  closeFinalizeErrorModal = () => {
    this.setState({ fireFinalizeErrorModal: false });
  };

  redirectToCreate = () => {
    this.props.history.push("/dashboard/election/create");
  };

  redirectToHome = () => {
    this.props.history.push("/dashboard/");
  };

  componentDidMount() {
    this._mounted = true;
    this.initializeRoute();
    this._updateRoute = setInterval(
      () => this.initializeRoute(false),
      1000 * 20
    );
  }

  initializeRoute = (affectLoader = true) => {
    if (this._mounted) {
      if (affectLoader) this.setState({ componentIsLoading: true });
      axios.defaults.withCredentials = true;
      const req = axios
        .get(`${process.env.REACT_APP_API_PATH}/api/dashboard/election`)
        .then(res => {
          if (res.data.isSessionValid === false)
            this.props.history.push("/login");
          else {
            this.setState({
              election: res.data.election,
              created_by: res.data.created_by,
              string_dates: res.data.string_dates,
              componentIsLoading: false,
            });
          }
        })
        .catch(res => fireAjaxErrorAlert(this, res.request.status, null));
      return req;
    }
  };

  componentWillUnmount() {
    this._mounted = false;
    clearInterval(this._updateRoute);
  }

  finalizeElection = () => {
    if (this._mounted) {
      this.setState({ finalizing: true });
      axios.defaults.withCredentials = true;
      axios(
        `${process.env.REACT_APP_API_PATH}/api/dashboard/election/finalize`,
        {
          method: "get",
        }
      )
        .then(res => {
          this.setState({ finalizing: false });
          if (res.data.isSessionValid === false) {
            this.props.history.push("/login");
          } else {
            if (res.data.exists === false)
              this.props.history.push("/dashboard/election");
            else if (res.data.error === "tooEarly")
              this.setState({
                fireFinalizeErrorModal: true,
                fireFinalizeModal: false,
              });
            else if (res.data.completed === true) {
              this.setState({
                fireFinalizeModal: false,
                fireFinalizeSuccessModal: true,
              });
            }
          }
        })
        .catch(res =>
          fireAjaxErrorAlert(this, res.request.status, null, false)
        );
    }
  };

  showFinalizeModal = e => {
    if (this._mounted) {
      e.preventDefault();
      this.setState({ fireFinalizeModal: true });
    }
  };

  showDeleteModal = e => {
    if (this._mounted) {
      e.preventDefault();
      this.setState({ fireDeleteModal: true });
    }
  };

  closeDeleteModal = () => {
    if (this._mounted) this.setState({ fireDeleteModal: false });
  };

  closeFinalizeModal = () => {
    if (this._mounted) this.setState({ fireFinalizeModal: false });
  };

  

  deleteElection = () => {
    if (this._mounted) {
      this.setState(
        {
          electionIsDeleting: true,
        },
        () => {
          axios.defaults.withCredentials = true;
          axios(`${process.env.REACT_APP_API_PATH}/api/dashboard/election`, {
            method: "delete",
          })
            .then(res => {
              if (res.data.isSessionValid === false)
                this.props.history.push("/login");
              else {
                this.setState({
                  fireDeleteModal: false,
                });
                if (res.data.exists === true)
                  this.props.history.push("/dashboard/election");
                else if (res.data.completed) {
                  this.setState({
                    fireDeleteModal: false,
                    fireDeleteSuccessModal: true,
                  });
                }
              }
            })
            .catch(res =>
              fireAjaxErrorAlert(this, res.request.status, null, false)
            );
        }
      );
    }
  };

  handleModalConfirmation = () => {
    if (this._mounted) {
      this.setState(
        { fireDeleteSuccessModal: false, fireFinalizeSuccessModal: false },
        this.initializeRoute
      );
    }
  };

  render() {
    return (
      <>
        <ElectionHomeRouteView
          componentIsLoading={this.state.componentIsLoading}
          finalizeElection={this.finalizeElection}
          userManager={this._userManager}
          closeDeleteModal={this.closeDeleteModal}
          closeFinalizeModal={this.closeFinalizeModal}
          showDeleteModal={this.showDeleteModal}
          showFinalizeModal={this.showFinalizeModal}
          deleteElection={this.deleteElection}
          handleModalConfirmation={this.handleModalConfirmation}
          redirectToCreate={this.redirectToCreate}
          redirectToHome={this.redirectToHome}
          closeNoElectionModal={this.closeNoElectionModal}
          closeFinalizeErrorModal={this.closeFinalizeErrorModal}
          {...this.props}
          {...this.state}
        />
        <ErrorAlert state={this.state} />
      </>
    );
  }
}

export default ElectionHomeRoute;
