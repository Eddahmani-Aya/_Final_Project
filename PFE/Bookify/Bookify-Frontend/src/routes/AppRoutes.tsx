import { Routes, Route } from "react-router-dom";
//Auth
import Home from "../pages/Auth/Home";
import Login from "../pages/Auth/Login";
import ClientRegister from "../pages/Auth/ClientRegister";
import PrestataireRegister from "../pages/Auth/PrestataireRegister";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import VerifyCode from "../pages/Auth/VerifyCode";
import ResetPassword from "../pages/Auth/ResetPassword";
//Client
import DashboardClient from "../pages/Client/Dashboard";
import HomeC from "../pages/Client/Home";
import MesRendezVous from "../pages/Client/MesRendezVous";
import Profils from "../pages/Client/Profils";
import ServiceProviders from "../components/Client/ServiceProviders";
import ServiceProviderProfile from "../components/Client/ProviderProfile";
//Provider
import DashboardProvider from "../pages/Provider/Dashboard";
import ProfilsP from "../pages/Provider/Profils";
import ListeDesDemandes from "../pages/Provider/ListeDesDemandes";
import Accepterrefuser from "../components/Provider/Accepterrefuser";
import MesRendezVousP from "../pages/Provider/MesRendezVous";
import Definirdisponibilites from "../pages/Provider/Definirdisponibilites";
import Statistiques from "../pages/Provider/Statistiques";


const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/PrestataireRegister" element={<PrestataireRegister />} />
    <Route path="/ClientRegister" element={<ClientRegister />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/verify-code" element={<VerifyCode />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    //Client
    <Route path="/Dashboard-Client" element={<DashboardClient />} />
    <Route path="/Home-Client" element={<HomeC />} />
    <Route path="/Mes-Rendez-Vous" element={<MesRendezVous />} />
    <Route path="/Profils" element={<Profils />} />
    <Route path="/Service-Providers/:serviceName" element={<ServiceProviders />} />
    <Route path="/Service-Provider-Profile/:providerId" element={<ServiceProviderProfile />} />
    //Provider
    <Route path="/Dashboard-Provider" element={<DashboardProvider />} />
    <Route path="/Profils-Provider" element={<ProfilsP />} />
    <Route path="/Liste-Des-Demandes" element={<ListeDesDemandes />} />
    <Route path="/Accepterrefuser/:demandeId" element={<Accepterrefuser />} />
    <Route path="/Mes-Rendez-Vous-Provider" element={<MesRendezVousP />} />
    <Route path="/Definir-Disponibilites" element={<Definirdisponibilites />} />
    <Route path="/Statistiques" element={<Statistiques />} />
  </Routes>
);

export default AppRoutes;
