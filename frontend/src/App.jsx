import React, { useState } from 'react';
import './App.css';

function App() {
  // Эгер null болсо — сайт ачылат, 'login' же 'register' болсо — форма ачылат
  const [authMode, setAuthMode] = useState(null); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  // Формадагы талаалар
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  // КАТТОО ФУНКЦИЯСЫ
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (password !== confirmPassword) {
      setMessage({ text: 'Паролдор бири-бирине дал келбейт!', type: 'error' });
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity, password })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: data.message, type: 'success' });
        setTimeout(() => {
          setIsLoggedIn(true);
          setCurrentUser(identity);
          setAuthMode(null); // Модальдык терезени жабуу
        }, 1200);
      } else {
        setMessage({ text: data.detail?.message || 'Ката чыкты', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Python серверине туташуу мүмкүн болгон жок.', type: 'error' });
    }
  };

  // КИРҮҮ ФУНКЦИЯСЫ
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity, password })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: data.message, type: 'success' });
        setTimeout(() => {
          setIsLoggedIn(true);
          setCurrentUser(identity);
          setAuthMode(null); // Модальдык терезени жабуу
        }, 1000);
      } else {
        setMessage({ text: data.detail?.message || 'Gmail же пароль ката!', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Python серверине туташуу мүмкүн болгон жок.', type: 'error' });
    }
  };

  // ЧЫГУУ ФУНКЦИЯСЫ
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser('');
  };

  return (
    <div className="site-wrapper">
      {/* 1. ХЕДЕР (Сайттын башкы менюсу) */}
      <header className="site-header">
        <div className="logo">OKURMEN<span>.IT</span></div>
        <nav className="site-nav">
          <a href="#courses">Курстар</a>
          <a href="#about">Биз жөнүндө</a>
          <a href="#support">Колдоо кызматы</a>
        </nav>
        
        <div className="auth-buttons-header">
          {isLoggedIn ? (
            <div className="user-profile-nav">
              <span className="user-email">👤 {currentUser}</span>
              <button onClick={handleLogout} className="btn-logout">Чыгуу</button>
            </div>
          ) : (
            <div className="header-login-btns">
              <button onClick={() => { setAuthMode('login'); setMessage({text:'',type:''}); }} className="btn-nav-login">Кирүү</button>
              <button onClick={() => { setAuthMode('register'); setMessage({text:'',type:''}); }} className="btn-nav-register">Каттоо</button>
            </div>
          )}
        </div>
      </header>

      {/* 2. НЕГИЗГИ САЙТТЫН МАЗМУНУ */}
      <main className="site-main fade-in">
        <section className="hero">
          <h1>Келечектин кесибин <br/><span className="highlight">OKURMEN.IT</span> менен баштаңыз</h1>
          <p>Заманбап IT багыттарын практика түрүндө үйрөнүңүз!</p>
        </section>

        <section id="courses" className="courses-section">
          <h2>Биздин Курстар</h2>
          <div className="courses-grid">
            <div className="course-card">
              <span className="badge">Тез старт</span>
              <h3>Frontend Интенсив</h3>
              <p className="duration">Мөөнөтү: 3 ай</p>
              <p className="description">HTML, CSS, JavaScript жана React аркылуу сайттарды куруу.</p>
              <div className="price">15 000 сом <span>/ айына</span></div>
              <button className="btn-enroll">Жазылуу</button>
            </div>

            <div className="course-card популярдуу">
              <span className="badge gold">ХИТ</span>
              <h3>Fullstack Профессионал</h3>
              <p className="duration">Мөөнөтү: 7 ай</p>
              <p className="description">React, Node.js, Python FastAPI жана маалымат базасы.</p>
              <div className="price">18 000 сом <span>/ айына</span></div>
              <button className="btn-enroll">Жазылуу</button>
            </div>

            <div className="course-card">
              <span className="badge blue">Сертификат</span>
              <h3>IT Менеджер / Карьера</h3>
              <p className="duration">Мөөнөтү: 1 жыл</p>
              <p className="description">Алдыңкы IT багыттары жана жумушка орношуу стратегиялары.</p>
              <div className="price">12 000 сом <span>/ айына</span></div>
              <button className="btn-enroll">Жазылуу</button>
            </div>
          </div>
        </section>

        <section id="support" className="support-section">
          <div className="support-card">
            <h3>💬 Суроолоруңуз барбы? Колдоо кызматы</h3>
            <p>Биздин менеджерлер сизге багыт тандоого жардам берет.</p>
            <div className="support-buttons">
              <a href="https://wa.me/996500000000" target="_blank" rel="noreferrer" className="btn-whatsapp">WhatsApp аркылуу байланышуу</a>
              <a href="tel:+996500000000" className="btn-call">Чалуу: +996 (500) 00-00-00</a>
            </div>
          </div>
        </section>
      </main>

      {/* 3. ФУТЕР */}
      <footer className="site-footer">
        <p>© 2026 OKURMEN.IT — Сапаттуу IT билим. Бардык укуктар корголгон.</p>
        <p>Бишкек ш., Кыргызстан</p>
      </footer>

      {/* 4. МОДАЛЬДЫК АВТОРИЗАЦИЯ ТЕРЕЗЕСИ (Кнопканы басканда гана калкып чыгат) */}
      {authMode && (
        <div className="modal-overlay" onClick={() => setAuthMode(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setAuthMode(null)}>✕</button>

            <div className="tabs">
              <div 
                className={`tab ${authMode === 'login' ? 'active' : ''}`} 
                onClick={() => { setAuthMode('login'); setMessage({text:'',type:''}); }}
              >
                Кирүү
              </div>
              <div 
                className={`tab ${authMode === 'register' ? 'active' : ''}`} 
                onClick={() => { setAuthMode('register'); setMessage({text:'',type:''}); }}
              >
                Каттоо
              </div>
            </div>

            {authMode === 'login' ? (
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Gmail же логин</label>
                  <input 
                    type="text" 
                    placeholder="example@gmail.com" 
                    value={identity}
                    onChange={(e) => setIdentity(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Пароль</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
                <button type="submit" className="btn-submit">Кирүү</button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label>Gmail же логин</label>
                  <input 
                    type="text" 
                    placeholder="example@gmail.com" 
                    value={identity}
                    onChange={(e) => setIdentity(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Пароль</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Паролду ырастаңыз</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                  />
                </div>
                <button type="submit" className="btn-submit">Катталуу</button>
              </form>
            )}

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;