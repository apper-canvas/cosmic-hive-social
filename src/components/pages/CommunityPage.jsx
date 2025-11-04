import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { communitiesService } from "@/services/api/communitiesService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Sidebar from "@/components/organisms/Sidebar";
import PostFeed from "@/components/organisms/PostFeed";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { formatNumber } from "@/utils/formatters";

const CommunityPage = () => {
  const { communityName } = useParams();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [postType, setPostType] = useState("all");
useEffect(() => {
    loadCommunity();
  }, [communityName]);

  const loadCommunity = async () => {
    try {
      setLoading(true);
      setError("");
      const communityData = await communitiesService.getByName(communityName);
      setCommunity(communityData);
    } catch (err) {
      console.error("Error loading community:", err);
      setError(err.message || "Failed to load community");
    } finally {
      setLoading(false);
    }
  };


  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `r/${community?.name} - Hive Social`,
          text: community?.description,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Community link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
      toast.error("Failed to share community");
    }
  };

const handleRetry = () => {
    loadCommunity();
  };

  const handlePostTypeChange = (type) => {
    setPostType(type);
  };

  const handleSubscribe = async () => {
    if (!community) return;

    try {
      const newSubscriptionStatus = !community.isSubscribed;
      await communitiesService.subscribe(community.id, newSubscriptionStatus);
      
      setCommunity(prev => ({
        ...prev,
        isSubscribed: newSubscriptionStatus,
        memberCount: newSubscriptionStatus 
          ? prev.memberCount + 1 
          : prev.memberCount - 1
      }));

      toast.success(
        newSubscriptionStatus ? "Subscribed to community!" : "Unsubscribed from community!"
      );
    } catch (err) {
      console.error("Error subscribing:", err);
      toast.error("Failed to update subscription");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Loading />
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Error
          message={error || "Community not found"}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Community Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {community.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-gray-900">
                  r/{community.name}
                </h1>
                <div className="flex items-center space-x-4 mt-1">
                  <Badge variant="outline">
                    <ApperIcon name="Users" className="w-3 h-3 mr-1" />
                    {formatNumber(community.memberCount)} members
                  </Badge>
                  <Badge variant="success">
                    <ApperIcon name="Circle" className="w-2 h-2 mr-1 fill-current" />
                    Online
                  </Badge>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed mb-4">
              {community.description}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={handleSubscribe}
              variant={community.isSubscribed ? "outline" : "primary"}
              className={community.isSubscribed 
                ? "border-primary text-primary hover:bg-primary hover:text-white"
                : "bg-gradient-to-r from-primary to-primary/80"
              }
            >
              {community.isSubscribed ? (
                <>
                  <ApperIcon name="UserMinus" className="w-4 h-4 mr-2" />
                  Subscribed
                </>
              ) : (
                <>
                  <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
                  Subscribe
                </>
              )}
</Button>

            <Button 
              variant="outline" 
              size="md"
              onClick={handleShare}
            >
              <ApperIcon name="Share" className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
<div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 lg:max-w-4xl">
          <PostFeed 
            communityName={communityName} 
            postType={postType}
            onPostTypeChange={handlePostTypeChange}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="space-y-6">
            {/* Community Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-display font-semibold text-gray-900 mb-3">
                About r/{community?.name}
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span className="font-medium">
                    {new Date(community?.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Members</span>
                  <span className="font-medium">
                    {formatNumber(community?.memberCount)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Online</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-success rounded-full mr-1"></div>
                    <span className="font-medium">
                      {Math.floor((community?.memberCount || 0) * 0.05)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full bg-gradient-to-r from-primary to-primary/80"
                  onClick={() => window.location.href = '/create'}
                >
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              </div>
            </div>

            {/* Community Rules */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-display font-semibold text-gray-900 mb-3">
                Community Rules
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Be respectful</h4>
                    <p className="text-gray-600">Treat all community members with respect and kindness.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Stay on topic</h4>
                    <p className="text-gray-600">Keep posts relevant to the community theme.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">No spam</h4>
                    <p className="text-gray-600">Avoid excessive self-promotion and spam content.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Moderators */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-display font-semibold text-gray-900 mb-3">
                Moderators
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">M</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">u/moderator_1</div>
                    <div className="text-gray-500 text-xs">Community founder</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">A</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">u/admin_user</div>
                    <div className="text-gray-500 text-xs">Senior moderator</div>
                  </div>
                </div>
              </div>
            </div>

            <Sidebar 
              className="space-y-6" 
              communityContext={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;