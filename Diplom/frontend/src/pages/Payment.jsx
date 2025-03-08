import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './Payment.css';

const Payment = ({ setUser, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.state?.courseId;
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = () => {
    if (formData.cardNumber && formData.expiryDate && formData.cvv && formData.name) {
      setPaymentSuccess(true);

      const updatedUser = { ...user, paidCourses: [...(user?.paidCourses || []), courseId] };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setTimeout(() => {
        navigate(`/courses/${courseId}`);
      }, 2000);
    } else {
      alert("Заполните все поля!");
    }
  };

  return (
    <div className="payment-container">
      <h1>Оплата курса</h1>

      {paymentSuccess ? (
        <p>Оплата успешно прошла ✅ Перенаправляем Вас на курс...</p>
      ) : (
        <div className="payment-form">
          <input type="text" name="name" placeholder="Имя на карте" onChange={handleChange} required />
          <input type="text" name="cardNumber" placeholder="Номер карты" onChange={handleChange} required />
          <input type="text" name="expiryDate" placeholder="MM/YY" onChange={handleChange} required />
          <input type="text" name="cvv" placeholder="CVV" onChange={handleChange} required />
          <button onClick={handlePayment}>Оплатить</button>
        </div>
      )}
    </div>
  );
};

export default Payment;
