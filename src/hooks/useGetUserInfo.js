export const useGetUserInfo = () => {
  // Parsowanie zapisanych danych użytkownika z localStorage
  const { name, profilePhoto, userID, isAuth, email } = JSON.parse(localStorage.getItem('auth')) || {};
  
  // Zwracanie wszystkich potrzebnych informacji o użytkowniku
  return { name, profilePhoto, userID, isAuth, email };
}
