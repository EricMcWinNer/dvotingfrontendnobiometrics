import React from "react";
import ReactTooltip from "react-tooltip";
import { contains } from "utils/helpers";
import { Link } from "react-router-dom";
import register from "assets/img/icons/register.png";
import search from "assets/img/icons/seo.png";

function OfficerLinks(props) {
  return (
    <>
      <div
        data-tip={"Register New Voter"}
        className={`sidebar-item${
          contains(props.location, "/dashboard/officer/register")
            ? " selected"
            : ""
        }`}
      >
        <Link to={"/dashboard/officer/register/voter"}>
          <img
            src={register}
            alt={"Register New Voter"}
            className={"sidebarIcon"}
          />
        </Link>
      </div>
      <div
        data-tip={"View Registered Voters"}
        className={`sidebar-item${
          contains(props.location, "/dashboard/officer/voters")
            ? " selected"
            : ""
        }`}
      >
        <Link to={"/dashboard/officer/voters"}>
          <img
            src={search}
            alt={"View Registered Voters"}
            className={"sidebarIcon"}
          />
        </Link>
      </div>
      <ReactTooltip
        place={"right"}
        className={"cartogothic"}
        type="dark"
        effect="solid"
      />
    </>
  );
}
export default OfficerLinks;
