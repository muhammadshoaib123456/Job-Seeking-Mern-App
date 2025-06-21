import React, { useContext } from "react";
import { Context } from "../../main";
import { Link } from "react-router-dom";
import {  FaGithub, FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

const Footer = () => {
  const { isAuthorized } = useContext(Context);
  return (
    <footer className={isAuthorized ? "footerShow" : "footerHide"}>
      <div>&copy; All Rights Reserved By Muhammad Shoaib.</div>
      <div>
       
        
        <Link to={"https://www.linkedin.com/in/muhammad-shoaib-bba3a8206"} target="_blank">
          <FaLinkedin />
        </Link>
        <Link to={"https://github.com/muhammadshoaib123456"} target="_blank">
         <FaGithub/>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;