import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { postsService } from "@/services/api/postsService";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.user);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [user, navigate]);
  
const [postData, setPostData] = useState({
    title: "",
    content: "",
    type: "text",
    imageUrl: "",
    videoUrl: "",
    linkUrl: "",
    communityName: "",
    flair: "",
    isNsfw: false,
    isSpoiler: false,
    pollOptions: ["", ""],
    pollDuration: "3" // days
  });
const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [activeTextFormat, setActiveTextFormat] = useState({});
const communities = [
    "technology", "programming", "gaming", "science", 
    "music", "movies", "books", "sports", "art", "photography"
  ];

  const communityFlairs = {
    technology: [
      { name: "News", color: "bg-blue-100 text-blue-800" },
      { name: "Discussion", color: "bg-green-100 text-green-800" },
      { name: "Help", color: "bg-yellow-100 text-yellow-800" },
      { name: "Review", color: "bg-purple-100 text-purple-800" }
    ],
    programming: [
      { name: "Question", color: "bg-orange-100 text-orange-800" },
      { name: "Tutorial", color: "bg-indigo-100 text-indigo-800" },
      { name: "Showcase", color: "bg-pink-100 text-pink-800" },
      { name: "Career", color: "bg-teal-100 text-teal-800" }
    ],
    gaming: [
      { name: "Discussion", color: "bg-red-100 text-red-800" },
      { name: "Screenshot", color: "bg-cyan-100 text-cyan-800" },
      { name: "Guide", color: "bg-lime-100 text-lime-800" },
      { name: "Meme", color: "bg-rose-100 text-rose-800" }
    ],
    science: [
      { name: "Research", color: "bg-emerald-100 text-emerald-800" },
      { name: "News", color: "bg-sky-100 text-sky-800" },
      { name: "Question", color: "bg-amber-100 text-amber-800" },
      { name: "Discussion", color: "bg-violet-100 text-violet-800" }
    ]
  };

const validateForm = () => {
    const newErrors = {};

    if (!postData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!postData.communityName) {
      newErrors.communityName = "Please select a community";
    }

    if (postData.type === "text" && !postData.content.trim()) {
      newErrors.content = "Content is required for text posts";
    }

    if (postData.type === "link" && !postData.linkUrl.trim()) {
      newErrors.linkUrl = "URL is required for link posts";
    }

    if (postData.type === "media" && !postData.imageUrl.trim() && !postData.videoUrl.trim()) {
      newErrors.media = "Image or video URL is required for media posts";
    }

    if (postData.type === "poll") {
      const validOptions = postData.pollOptions.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        newErrors.poll = "Poll must have at least 2 options";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleInputChange = (field, value) => {
    setPostData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handlePollOptionChange = (index, value) => {
    const newOptions = [...postData.pollOptions];
    newOptions[index] = value;
    setPostData(prev => ({
      ...prev,
      pollOptions: newOptions
    }));
  };

  const addPollOption = () => {
    if (postData.pollOptions.length < 6) {
      setPostData(prev => ({
        ...prev,
        pollOptions: [...prev.pollOptions, ""]
      }));
    }
  };

  const removePollOption = (index) => {
    if (postData.pollOptions.length > 2) {
      const newOptions = postData.pollOptions.filter((_, i) => i !== index);
      setPostData(prev => ({
        ...prev,
        pollOptions: newOptions
      }));
    }
  };

  const applyTextFormat = (format) => {
    setActiveTextFormat(prev => ({
      ...prev,
      [format]: !prev[format]
    }));
  };

  const handleCancel = () => {
    navigate(-1);
  };

const handleTypeChange = (type) => {
    setPostData(prev => ({
      ...prev,
      type,
      content: type === "text" ? prev.content : "",
      linkUrl: type === "link" ? prev.linkUrl : "",
      imageUrl: type === "media" ? prev.imageUrl : "",
      videoUrl: type === "media" ? prev.videoUrl : "",
      pollOptions: type === "poll" ? prev.pollOptions : ["", ""]
    }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Filter out empty poll options
      const processedData = {
        ...postData,
        pollOptions: postData.type === "poll" 
          ? postData.pollOptions.filter(opt => opt.trim())
          : []
      };
      
      const newPost = await postsService.create(processedData);
      toast.success("Post created successfully!");
      navigate(`/post/${newPost.Id}`);
    } catch (err) {
      console.error("Error creating post:", err);
      toast.error("Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  const postTypes = [
    { id: "text", label: "Text Post", icon: "FileText" },
    { id: "media", label: "Image/Video", icon: "Image" },
    { id: "link", label: "Link", icon: "ExternalLink" },
    { id: "poll", label: "Poll", icon: "BarChart3" }
  ];

return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
          Create a post
        </h1>
        <p className="text-gray-600">
          Share something interesting with the community
        </p>
      </div>

      {/* Create Post Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Community Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Choose a community
          </label>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {communities.map(community => (
              <button
                key={community}
                type="button"
                onClick={() => handleInputChange("communityName", community)}
                className={`p-3 text-sm rounded-lg border-2 transition-all duration-200 ${
                  postData.communityName === community
                    ? "border-primary bg-primary/5 text-primary font-medium"
                    : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                r/{community}
              </button>
            ))}
          </div>
          
          {errors.communityName && (
            <p className="text-error text-sm mt-2">{errors.communityName}</p>
          )}
        </div>

        {/* Flair Selection */}
        {postData.communityName && communityFlairs[postData.communityName] && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Choose a flair (optional)
            </label>
            
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleInputChange("flair", "")}
                className={`px-3 py-1 text-sm rounded-full border-2 transition-all duration-200 ${
                  !postData.flair
                    ? "border-gray-400 bg-gray-100 text-gray-700 font-medium"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                No flair
              </button>
              {communityFlairs[postData.communityName].map(flair => (
                <button
                  key={flair.name}
                  type="button"
                  onClick={() => handleInputChange("flair", flair.name)}
                  className={`px-3 py-1 text-sm rounded-full border-2 transition-all duration-200 ${
                    postData.flair === flair.name
                      ? `${flair.color} border-current font-medium`
                      : `${flair.color} border-transparent hover:border-current`
                  }`}
                >
                  {flair.name}
                </button>
              ))}
            </div>
          </div>
        )}

{/* Post Type Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {postTypes.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleTypeChange(type.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    postData.type === type.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <ApperIcon name={type.icon} className="w-4 h-4" />
                  <span>{type.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Title *
              </label>
              <Input
                value={postData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="An interesting title"
                error={errors.title}
                maxLength={300}
              />
              {errors.title && (
                <p className="text-error text-sm mt-2">{errors.title}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                {postData.title.length}/300 characters
              </p>
            </div>

            {/* Text Post Content */}
            {postData.type === "text" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Content *
                </label>
                
                {/* Rich Text Toolbar */}
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center space-x-1">
                    {[
                      { name: "Bold", icon: "Bold", format: "bold" },
                      { name: "Italic", icon: "Italic", format: "italic" },
                      { name: "Underline", icon: "Underline", format: "underline" },
                      { name: "Strikethrough", icon: "Strikethrough", format: "strikethrough" }
                    ].map(item => (
                      <button
                        key={item.format}
                        type="button"
                        onClick={() => applyTextFormat(item.format)}
                        className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
                          activeTextFormat[item.format] ? "bg-gray-300" : ""
                        }`}
                        title={item.name}
                      >
                        <ApperIcon name={item.icon} className="w-4 h-4" />
                      </button>
                    ))}
                    <div className="w-px h-6 bg-gray-300 mx-1" />
                    {[
                      { name: "List", icon: "List", format: "list" },
                      { name: "Numbered List", icon: "ListOrdered", format: "numberedList" },
                      { name: "Quote", icon: "Quote", format: "quote" },
                      { name: "Code", icon: "Code", format: "code" }
                    ].map(item => (
                      <button
                        key={item.format}
                        type="button"
                        onClick={() => applyTextFormat(item.format)}
                        className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
                          activeTextFormat[item.format] ? "bg-gray-300" : ""
                        }`}
                        title={item.name}
                      >
                        <ApperIcon name={item.icon} className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                  
                  <Textarea
                    value={postData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    placeholder="What would you like to discuss?"
                    rows={8}
                    className="border-0 resize-none focus:ring-0 focus:border-0"
                  />
                </div>
                {errors.content && (
                  <p className="text-error text-sm mt-2">{errors.content}</p>
                )}
              </div>
            )}
</div>

            {/* Link Post Content */}
            {postData.type === "link" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  URL *
                </label>
                <Input
                  type="url"
                  value={postData.linkUrl}
                  onChange={(e) => handleInputChange("linkUrl", e.target.value)}
                  placeholder="https://example.com"
                  error={errors.linkUrl}
                />
                {errors.linkUrl && (
                  <p className="text-error text-sm mt-2">{errors.linkUrl}</p>
                )}
                
                {/* Optional description for links */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Description (optional)
                  </label>
                  <Textarea
                    value={postData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    placeholder="Add some context about this link..."
                    rows={4}
                  />
                </div>
</div>
            )}

            {/* Image/Video Post Content */}
            {postData.type === "media" && (
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Image URL
                    </label>
                    <Input
                      type="url"
                      value={postData.imageUrl}
                      onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Video URL
                    </label>
                    <Input
                      type="url"
                      value={postData.videoUrl}
                      onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                      placeholder="https://example.com/video.mp4"
                    />
                  </div>
                </div>
                
                {errors.media && (
                  <p className="text-error text-sm mt-2">{errors.media}</p>
                )}
                
                {/* Preview */}
                {(postData.imageUrl || postData.videoUrl) && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      {postData.imageUrl && (
                        <img
                          src={postData.imageUrl}
                          alt="Preview"
                          className="max-w-xs h-auto rounded-lg shadow-sm mb-2"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      )}
                      {postData.videoUrl && (
                        <video
                          src={postData.videoUrl}
                          className="max-w-xs h-auto rounded-lg shadow-sm"
                          controls
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Optional description */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Description (optional)
                  </label>
                  <Textarea
                    value={postData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    placeholder="Add some context about this media..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Poll Post Content */}
            {postData.type === "poll" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Poll Options *
                </label>
                
                <div className="space-y-3">
                  {postData.pollOptions.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                        {index + 1}
                      </div>
                      <Input
                        value={option}
                        onChange={(e) => handlePollOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1"
                      />
                      {postData.pollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removePollOption(index)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {postData.pollOptions.length < 6 && (
                  <button
                    type="button"
                    onClick={addPollOption}
                    className="mt-3 flex items-center space-x-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                  >
                    <ApperIcon name="Plus" className="w-4 h-4" />
                    <span>Add option</span>
                  </button>
                )}

                {errors.poll && (
                  <p className="text-error text-sm mt-2">{errors.poll}</p>
                )}

                {/* Poll duration */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Poll duration
                  </label>
                  <select
                    value={postData.pollDuration}
                    onChange={(e) => handleInputChange("pollDuration", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="1">1 day</option>
                    <option value="3">3 days</option>
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                  </select>
                </div>
              </div>
)}

            {/* Content Moderation Toggles */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Content options</h4>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={postData.isNsfw}
                    onChange={(e) => handleInputChange("isNsfw", e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                  />
                  <div className="flex items-center space-x-2">
                    <Badge variant="destructive" size="sm">NSFW</Badge>
                    <span className="text-sm text-gray-700">Not safe for work</span>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={postData.isSpoiler}
                    onChange={(e) => handleInputChange("isSpoiler", e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                  />
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" size="sm">SPOILER</Badge>
                    <span className="text-sm text-gray-700">Hide content behind spoiler warning</span>
                  </div>
                </label>
</div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {postData.isNsfw && <Badge variant="destructive" size="sm" className="mr-2">NSFW</Badge>}
                {postData.isSpoiler && <Badge variant="secondary" size="sm" className="mr-2">SPOILER</Badge>}
                {postData.flair && (
                  <Badge 
                    size="sm" 
                    className={communityFlairs[postData.communityName]?.find(f => f.name === postData.flair)?.color || "bg-gray-100 text-gray-800"}
                  >
                    {postData.flair}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting || !postData.title.trim() || !postData.communityName}
                  className="bg-gradient-to-r from-primary to-primary/80"
                >
                  {submitting ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                      Create Post
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
};

export default CreatePost;