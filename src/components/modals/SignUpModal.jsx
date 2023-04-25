import { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useModalContext } from '../../hooks/useModalContext';
import { useSignUp } from '../../hooks/useSignUp';

import Modal from './Modal';

export default function SignUpModal() {
  const { closeModal } = useModalContext();

  // form controls & alidation
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);

  const { user } = useAuthContext();
  const { signup, error } = useSignUp();

  function handleSubmit(e) {
    e.preventDefault();
    signup(displayName, email, password);
  }

  useEffect(() => {
    if (user) closeModal(); // close sign in modal on signup

    if (error) {
      setValidEmail(true);
      setValidPassword(true);

      if (error.includes('email')) {
        alert('Email already in use');
        setValidEmail(false);
      }
      setValidPassword(!error.includes('password'));
    }
  }, [user, error, closeModal]);

  return (
    <Modal className={'auth-modal'}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="first name"
          onChange={e => setDisplayName(e.target.value)}
          value={displayName}
          required
          autoFocus
        />
        <input
          type="email"
          placeholder="email"
          onChange={e => setEmail(e.target.value)}
          value={email}
          className={validEmail ? '' : 'invalid'}
          required
        />
        <input
          type="password"
          placeholder="password (6 characters or more)"
          onChange={e => setPassword(e.target.value)}
          value={password}
          className={validPassword ? '' : 'invalid'}
          required
        />
        <button className="btn">Sign Up</button>
      </form>
      <button
        type="button"
        className="modal-actions modal-icon"
        onClick={closeModal}>
        <i className="fa-solid fa-x"></i>
      </button>
    </Modal>
  );
}
