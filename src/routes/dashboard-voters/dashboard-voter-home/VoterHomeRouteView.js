import React from "react";
import Helmet from "react-helmet";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import "./index.sass";
import BaseCard from "components/cards/base-card";
import SubRouteLoader from "components/loaders/dashboard-sub-route";
import { votersModel } from "utils/tablemodels";
import voters from "assets/img/icons/voter.png";
import PureTable from "components/dashboard/pure-table";
import PureSelect from "components/dashboard/pure-select";

function VoterHomeRouteView(props) {
  const handleKeyUp = e => {
    if (e.keyCode === 13)
      props.getSearchResults(props.searchNeedle.current.value);
  };
  let votersData, states, lgas;
  if (!props.componentIsLoading) {
    votersData = props.voters.map((voter, index) => ({
      serial: (props.currentPage - 1) * props.perPage + (index + 1),
      reversedRoles: JSON.parse(voter.roles).reverse(),
      ...voter,
    }));
    states = props.states.map((state, index) => (
      <option value={state.state_id} key={index}>
        {state.name}
      </option>
    ));
    lgas = props.lgas.map((lga, index) => (
      <option value={lga.lga_id} key={index}>
        {lga.name} - {lga.state.name}
      </option>
    ));
  }
  return props.componentIsLoading ? (
    <SubRouteLoader />
  ) : (
    <Row id={"voters"}>
      <Col md={12}>
        <BaseCard>
          <Helmet>
            <title>{process.env.REACT_APP_NAME} | View Voters</title>
          </Helmet>
          <div className="title clearfix o-auto">
            <div className="float-left">
              <img
                src={voters}
                alt="No parties found"
                className={"title-icon small"}
              />
            </div>
            <div className="float-left">
              <p className={"title"}>Voters</p>
            </div>
          </div>
          <p className="subtitle poppins">
            In this section you can view all the voters registered in the
            application.
          </p>
          <div className={"searchTools"}>
            <ul className={"o-auto clearfix"}>
              <li>
                <label htmlFor={"filterState"}>Filter by state:</label>
                <PureSelect
                  name={"filterState"}
                  id={"filterState"}
                  className={"filterVoters custom-select"}
                  value={props.selectedState}
                  onChange={e => props.handleFilterSelect(e)}
                  firstOption={<option value={""}>None</option>}
                >
                  {states}
                </PureSelect>
              </li>
              <li>
                <label htmlFor={"filterLGA"}>Filter by LGA:</label>
                <PureSelect
                  name={"filterLGA"}
                  id={"filterLGA"}
                  className={"filterVoters custom-select"}
                  value={props.selectedLga}
                  onChange={e => props.handleFilterSelect(e)}
                  firstOption={<option value={""}>None</option>}
                >
                  {lgas}
                </PureSelect>
              </li>
              <li className="float-right">
                <label htmlFor={"searchNeedle"}>Search:</label>
                <input
                  type={"search"}
                  name={"searchNeedle"}
                  id={"searchNeedle"}
                  ref={props.searchNeedle}
                  className={"searchVoter"}
                  onKeyUp={e => handleKeyUp(e)}
                  placeholder={"Search for a voter"}
                />
                <button
                  className="closeSearch"
                  onClick={e => props.clearSearch(e)}
                >
                  &times;
                </button>
              </li>
            </ul>
          </div>
          <div className={"DataTableContainer"}>
            <PureTable
              noHeader
              striped
              columns={votersModel}
              data={votersData}
              pagination
              paginationServer
              paginationTotalRows={props.totalResults}
              onChangePage={page => props.changePage(page)}
              onChangeRowsPerPage={(currentRowsPerPage, currentPage) =>
                props.changeRowsPerPage(currentRowsPerPage, currentPage)
              }
              paginationPerPage={20}
            />
            {props.tableLoading && (
              <div className="DataTableLoader">
                <SubRouteLoader />
              </div>
            )}
          </div>
        </BaseCard>
      </Col>
    </Row>
  );
}

export default VoterHomeRouteView;
