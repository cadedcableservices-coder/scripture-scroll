import FeedContainer from "./components/FeedContainer";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";

export default function App() {
  const path = window.location.pathname;

  if (path === "/terms") return <TermsPage />;
  if (path === "/privacy") return <PrivacyPage />;

  return (
    <div className="h-[100dvh] w-full bg-ink">
      <FeedContainer />
    </div>
  );
}
