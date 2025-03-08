import React from "react";
import { useParams } from "react-router-dom";

function Materials({ user }) {
  const { courseId } = useParams();
  if (!user) return <p>Пожалуйста, войдите, чтобы просматривать материалы.</p>;
  return <h2>Материалы курса {courseId}</h2>;
}

export default Materials;