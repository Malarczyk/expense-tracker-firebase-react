import ProtectedRoute from './ProtectedRoute'; // Zaimportuj ProtectedRoute
import { isUserAuthenticated } from './auth'; // Zaimportuj funkcję sprawdzającą autentykację

function App() {
  // Uzyskaj stan autentykacji użytkownika (to może pochodzić z kontekstu, Reduxa, itp.)
  const isAuth = isUserAuthenticated();

  return (
    <Router>
      {/* ... */}
      <Routes>
        <Route path="/" exact element={<Auth installEvent={installEvent} setInstallEvent={setInstallEvent}/>} />
        <ProtectedRoute path="/home/*" component={Home} isAuth={isAuth} />
        <ProtectedRoute path="/categories" component={Categories} isAuth={isAuth} />
        {/* ... inne ochronione trasy ... */}
      </Routes>
      {/* ... */}
    </Router>
  );
}

export default App;
