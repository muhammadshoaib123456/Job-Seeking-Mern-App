import React from 'react'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { Context } from '../../main'
import HeroSection from "./heroSection"
import HowItWorks from './howItWorks'
import PopularCategories from "./popularCategories"
import PopularCompanies from './popularCompanies'

const Home = () => {
  const { isAuthorized } = useContext(Context);
  if (!isAuthorized) {
    return <Navigate to={"/login"} />;
  }
  return (
    <>
      <section className="homePage page">
        <HeroSection />
        <HowItWorks />
        <PopularCategories />
        <PopularCompanies />
      </section>
    </>
  );
};

export default Home;