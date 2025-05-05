import React, { useState, useEffect } from 'react';

function Settings({ user }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [certName, setCertName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setCertName(`${user.firstName || ''} ${user.lastName || ''}`);
            setEmail(user.email || '');
        }
    }, [user]);

    const getInitials = () => {
        if (!firstName && !lastName) return '??';
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Вы уверены, что хотите удалить аккаунт?')) {
            // Здесь логика удаления
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-8 space-y-5">
            {/* Аватар */}
            <div className="relative flex justify-center">
                <div
                    className="w-24 h-24 rounded-full text-white text-3xl font-bold flex items-center justify-center"
                    style={{ backgroundColor: user?.color || '#333' }}
                >
                    {getInitials()}
                </div>
                <div className="absolute bottom-2 right-[calc(50%-48px)] bg-gray-600 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center cursor-pointer">
                    ✎
                </div>
            </div>

            {/* Имя */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-gray-500"
                    placeholder="Имя"
                />
            </div>

            {/* Фамилия */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-gray-500"
                    placeholder="Фамилия"
                />
            </div>

            {/* Имя на сертификате */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Имя на сертификате</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={certName}
                        onChange={(e) => setCertName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                    />
                    <button className="px-4 py-2 bg-gray-800 text-white rounded-md">
                        Запросить изменение
                    </button>
                </div>
            </div>

            {/* Смена пароля */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Изменить пароль</label>
                <input
                    type="password"
                    placeholder="Текущий пароль"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-md"
                />
                <input
                    type="password"
                    placeholder="Новый пароль"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-md"
                />
                <input
                    type="password"
                    placeholder="Подтверждение нового пароля"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                <button className="mt-2 px-4 py-2 bg-gray-800 text-white rounded-md w-full">
                    Изменить пароль
                </button>
            </div>

            {/* Смена email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Электронная почта</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-md"
                />
                <div className="flex gap-2">
                    <input
                        type="email"
                        placeholder="Новая электронная почта"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                    <button className="px-4 py-2 bg-gray-800 text-white rounded-md">
                        Изменить Email
                    </button>
                </div>
            </div>

            {/* Удалить аккаунт */}
            <div className="pt-4">
                <button
                    className="w-full px-4 py-2 border-2 border-red-500 text-red-600 rounded-md hover:bg-red-500 hover:text-white transition"
                    onClick={handleDeleteAccount}
                >
                    Удалить аккаунт
                </button>
            </div>
        </div>
    );
}

export default Settings;
