import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from '../redux/userSlice';
import styled from 'styled-components';
import { updateCustomer } from '../redux/userHandle';

const Logout = () => {
  const { currentUser, currentRole } = useSelector(state => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentRole === "Customer") {
      console.log(currentUser);
      dispatch(updateCustomer(currentUser, currentUser._id));
    }
  }, [currentRole, currentUser, dispatch]);

  const handleLogout = () => {
    dispatch(authLogout());
    navigate('/');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <LogoutContainer>
      <h1>{currentUser.name}</h1>
      <LogoutMessage>Biztos vagy benne, hogy kilépsz?</LogoutMessage>
      <LogoutButtonLogout onClick={handleLogout}>Kijelentkezés</LogoutButtonLogout>
      <LogoutButtonCancel onClick={handleCancel}>Mégsem</LogoutButtonCancel>
    </LogoutContainer>
  );
};

export default Logout;

const LogoutContainer = styled.div`
  border: 1px solid #dfe6e9;
  border-radius: 12px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  background-color: #f8f9fa;
  color: #2d3436;
  max-width: 400px;
  margin: 20vh auto;
  text-align: center;
`;

const LogoutMessage = styled.p`
  margin-bottom: 20px;
  font-size: 18px;
  color: #636e72;
`;

const LogoutButton = styled.button`
  padding: 12px 24px;
  margin-top: 15px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  transition: background-color 0.3s ease;
`;

const LogoutButtonLogout = styled(LogoutButton)`
  background-color: #d63031; /* Enyhén piros */
  &:hover {
    background-color: rgba(255,53,53,0.85); /* Sötétebb piros hover hatásra */
  }
`;

const LogoutButtonCancel = styled(LogoutButton)`
  background-color: rgba(13, 107, 181, 0.84); /* Kék szín a visszavonás gombhoz */

  &:hover {
    background-color: #74b9ff; /* Világosabb kék hover hatásra */
  }
`;
