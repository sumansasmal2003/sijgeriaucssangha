import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// --- Component Imports ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UserProtectedRoute from './components/auth/UserProtectedRoute';

// --- Page Imports ---
import HomePage from './pages/HomePage';
import UserRegisterPage from './pages/auth/UserRegisterPage';
import CombinedLoginPage from './pages/auth/CombinedLoginPage'; // <-- Import new page
import CompleteMemberProfilePage from './pages/auth/CompleteMemberProfilePage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import MemberProtectedRoute from './components/auth/MemberProtectedRoute';
import MemberDashboard from './pages/member/MemberDashboard';
import ManageEventsPage from './pages/member/ManageEventsPage';
import ManageGalleryPage from './pages/member/ManageGalleryPage';
import ProfileSettingsPage from './pages/member/ProfileSettingsPage';
import InviteMemberPage from './pages/member/InviteMemberPage';
import GalleryPage from './pages/GalleryPage';
import EventsPage from './pages/EventsPage';
import ManageUsersPage from './pages/member/ManageUsersPage';
import DonatePage from './pages/DonatePage';
import EventParticipantsPage from './pages/member/EventParticipantsPage';
import MemberDirectoryPage from './pages/member/MemberDirectoryPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import ManageAnnouncementsPage from './pages/member/ManageAnnouncementsPage';
import UserDashboard from './pages/user/UserDashboard';
import BlockStatusPage from './pages/auth/BlockStatusPage';
import ParticipatePage from './pages/user/ParticipatePage';
import UserProfileSettingsPage from './pages/user/ProfileSettingsPage';
import OurTeamPage from './pages/OurTeamPage';
import LogHoursPage from './pages/user/LogHoursPage';
import ApproveHoursPage from './pages/member/ApproveHoursPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import VolunteersPage from './pages/VolunteersPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';

const NotFoundPage = () => <div className="text-center p-10"><h1 className="text-4xl font-bold">404 - Page Not Found</h1></div>;

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#18181B',
            color: '#F8F8F8',
            border: '1px solid #27272A',
          },
        }}
      />
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-grow">
          <div className="pb-16 lg:pb-0">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/donate" element={<DonatePage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="/our-team" element={<OurTeamPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/volunteer" element={<VolunteersPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsAndConditionsPage />} />

              {/* Auth Routes */}
              <Route path="/login" element={<CombinedLoginPage />} />
              <Route path="/block-status" element={<BlockStatusPage />} />
              <Route path="/register" element={<UserRegisterPage />} />
              <Route path="/complete-profile/:token" element={<CompleteMemberProfilePage />} />
              <Route path="/password/forgot" element={<ForgotPasswordPage />} />
              <Route path="/password/reset/:token" element={<ResetPasswordPage />} />

              <Route
              path="/user/dashboard"
              element={
                <UserProtectedRoute>
                  <UserDashboard />
                </UserProtectedRoute>
              }
            />

            <Route
              path="/participate"
              element={<UserProtectedRoute><ParticipatePage /></UserProtectedRoute>}
            />

            <Route
              path="/user/profile"
              element={<UserProtectedRoute><UserProfileSettingsPage /></UserProtectedRoute>}
            />

            <Route
            path="/user/log-hours"
            element={<UserProtectedRoute><LogHoursPage /></UserProtectedRoute>}
          />

              <Route
                path="/member/dashboard"
                element={
                  <MemberProtectedRoute>
                    <MemberDashboard />
                  </MemberProtectedRoute>
                }
              />
               <Route
                path="/member/events"
                element={
                  <MemberProtectedRoute>
                    <ManageEventsPage />
                  </MemberProtectedRoute>
                }
              />
               <Route
                path="/member/gallery"
                element={
                  <MemberProtectedRoute>
                    <ManageGalleryPage />
                  </MemberProtectedRoute>
                }
              />
               <Route
                path="/member/profile"
                element={
                  <MemberProtectedRoute>
                    <ProfileSettingsPage />
                  </MemberProtectedRoute>
                }
              />

              <Route
              path="/member/users"
              element={<MemberProtectedRoute><ManageUsersPage /></MemberProtectedRoute>}
            />

              <Route
              path="/member/invite"
              element={<MemberProtectedRoute><InviteMemberPage /></MemberProtectedRoute>}
            />

              <Route
              path="/member/events/participants/:eventId"
              element={<MemberProtectedRoute><EventParticipantsPage /></MemberProtectedRoute>}
            />

            <Route
              path="/member/directory"
              element={<MemberProtectedRoute><MemberDirectoryPage /></MemberProtectedRoute>}
            />

            <Route
              path="/member/announcements"
              element={<MemberProtectedRoute><ManageAnnouncementsPage /></MemberProtectedRoute>}
            />

            <Route
            path="/member/approve-hours" // <-- NEW ROUTE
            element={<MemberProtectedRoute><ApproveHoursPage /></MemberProtectedRoute>}
          />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
