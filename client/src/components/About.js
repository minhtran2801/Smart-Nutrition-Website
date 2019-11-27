import React from 'react';

function About() {
  return (
    <div className="container">
      <p className="flow-text">
        <a
          target="_blank"
          href="https://www.omnicalculator.com/health/bmr#bmr-vs-rmr">
          BMR Calculator
        </a>
        <p>
          Basal metabolic rate (BMR) is the total number of calories that your
          body needs to perform basic, life-sustaining functions. These basal
          functions include circulation, breathing, cell production, nutrient
          processing, protein synthesis, and ion transport. You can calculate
          basal metabolic rate using a mathematical formula.
        </p>
        <br />
        <a
          target="_blank"
          href="http://nationalacademies.org/hmd/Activities/Nutrition/SummaryDRIs/DRI-Tables.aspx">
          Dietary Reference Intakes Tables
        </a>
        <p>
          The Dietary Reference Intakes (DRIs) are nutrient reference values
          developed by the Institute of Medicine of The National Academies. They
          are intended to serve as a guide for good nutrition and provide the
          scientific basis for the development of food guidelines in both the
          United States and Canada. These nutrient reference values are
          specified on the basis of age, gender and lifestage and cover more
          than 40 nutrient substances.
        </p>
      </p>
    </div>
  );
}

export default About;
