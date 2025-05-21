import './Security2FA.css';
import { useState, useEffect } from 'react';

import TwoFAModals from './TwoFAModals';

function Security() {
    const [showModal, setShowModal] = useState('none');
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.email) {
            fetch('http://localhost:5001/api/check-2fa-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email })
            })
                .then(res => res.json())
                .then(data => {
                    if (data?.is2fa_enabled) {
                        setIs2FAEnabled(true);
                    } else {
                        setIs2FAEnabled(false);
                    }
                })
                .catch(err => console.error('Ошибка при проверке 2FA:', err));
        }
    }, []);


    const handleEnableClick = () => {
        setShowModal('password');
    };
    const handleDisable2FA = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.email) return;

        try {
            const res = await fetch('http://localhost:5001/api/disable-2fa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setIs2FAEnabled(true);
                setIs2FAEnabled(false);
            }
        } catch (err) {
            console.error('Ошибка при отключении 2FA:', err);
        }
    };


    return (
        <div className="security-container">
            <h2>Двухфакторная аутентификация (2FA)</h2>
            <p>
                Двухфакторная аутентификация (2FA) — это дополнительная защита вашего аккаунта. <br />
                После включения 2FA, при каждом входе в аккаунт, вам нужно будет не только ввести пароль, но и подтвердить вход с помощью одноразового кода, который будет отправлен на вашу электронную почту.
            </p>

            <div className="twofa-toggle">
                <label>
                    on
                    <input
                        type="radio"
                        name="2fa"
                        checked={is2FAEnabled}
                        onChange={handleEnableClick}
                    />
                </label>

                <label>
                    off
                    <input
                        type="radio"
                        name="2fa"
                        checked={!is2FAEnabled}
                        onChange={handleDisable2FA}
                    />
                </label>

                <div className="twofa-controls">
                    <button className="enable-btn" onClick={handleEnableClick}>
                        Включить двухфакторную аутентификацию (2FA)
                    </button>
                </div>
            </div>

            <TwoFAModals visible={showModal} setVisible={setShowModal} setIs2FAEnabled={setIs2FAEnabled} />
        </div>
    );
}
export default Security;

