import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './context/ToastContext';

// Lazily loaded pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AddCoursePage = lazy(() => import('./pages/AddCoursePage'));
const EditCoursePage = lazy(() => import('./pages/EditCoursePage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CertificatePage = lazy(() => import('./pages/CertificatePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const MentorshipPage = lazy(() => import('./pages/MentorshipPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));

function App() {
  const { loading } = useAuth();
  const [appReady, setAppReady] = useState(false);
  const [apiStatus, setApiStatus] = useState({ connected: false, error: null });

  // Simulate initial loading
  useEffect(() => {
    setTimeout(() => {
      setAppReady(true);
    }, 500);

    // Test API connection on startup with improved error handling
    fetch('/api/status')
      .then(res => {
        if (!res.ok) {
          throw new Error(`API returned ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('API Status:', data);
        setApiStatus({ connected: true, error: null });
      })
      .catch(err => {
        console.error('API Connection Error:', err);
        setApiStatus({ connected: false, error: err.message });
        // Don't block app loading on API error, just log it
      });
  }, []);

  if (loading || !appReady) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingScreen />}>
        {/* Show API warning if connection failed but don't block app */}
        {!apiStatus.connected && apiStatus.error && (
          <div style={{
            background: '#fff3cd',
            color: '#856404',
            padding: '10px 15px',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            Warning: API connection failed. Some features may not work. {apiStatus.error}
          </div>
        )}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/course/:id" element={<CourseDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          <Route path="/calendar" element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          } />

          <Route path="/certificate/:courseId" element={
            <ProtectedRoute>
              <CertificatePage />
            </ProtectedRoute>
          } />

          <Route path="/add-course" element={
            <ProtectedRoute requireAdmin={true}>
              <AddCoursePage />
            </ProtectedRoute>
          } />

          <Route path="/edit-course/:id" element={
            <ProtectedRoute requireAdmin={true}>
              <EditCoursePage />
            </ProtectedRoute>
          } />

          {/* Fixed admin dashboard route */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } />

          <Route path="/mentorship" element={
            <ProtectedRoute>
              <MentorshipPage />
            </ProtectedRoute>
          } />

          <Route path="/events" element={<EventsPage />} />

          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
