import PostFeed from "@/components/organisms/PostFeed";
import Sidebar from "@/components/organisms/Sidebar";

const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 lg:max-w-4xl">
          <PostFeed />
        </div>

        {/* Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default HomePage;