import React, { useState } from 'react';
import { Button, Dropdown, Tooltip, message } from 'antd';
import { 
  ShareAltOutlined, 
  TwitterOutlined, 
  FacebookOutlined, 
  LinkedinOutlined, 
  WhatsAppOutlined,
  CopyOutlined,
  CheckOutlined
} from '@ant-design/icons';

const SocialShare = ({ 
  title = "Check out this quiz result!",
  description = "I just completed a quiz on the Quiz Platform.",
  url = window.location.href,
  score = null,
  imageUrl = ""
}) => {
  const [copied, setCopied] = useState(false);

  // Format score message if provided
  const scoreText = score 
    ? `I scored ${score.correct}/${score.total} (${score.percentage}%)!` 
    : '';
    
  // Combine share text
  const shareText = `${title} ${scoreText} ${description}`;
  
  // Encode parameters for sharing
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(url);
  const encodedHashtags = encodeURIComponent('QuizApp,Learning');
  
  // Share URLs for different platforms
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=QuizApp,Learning`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText} ${encodedUrl}`
  };

  // Open share dialog in a popup window
  const openShareWindow = (url) => {
    window.open(url, '_blank', 'width=600,height=400');
  };
  
  // Copy link to clipboard
  const copyToClipboard = () => {
    const textToCopy = `${shareText} ${url}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      message.success('Link copied to clipboard!');
      
      // Reset the copied state after 3 seconds
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }).catch(err => {
      message.error('Failed to copy link');
      console.error('Failed to copy: ', err);
    });
  };

  // Dropdown menu items for share options
  const items = [
    {
      key: 'twitter',
      label: 'Twitter',
      icon: <TwitterOutlined style={{ color: '#1DA1F2' }} />,
      onClick: () => openShareWindow(shareUrls.twitter)
    },
    {
      key: 'facebook',
      label: 'Facebook',
      icon: <FacebookOutlined style={{ color: '#4267B2' }} />,
      onClick: () => openShareWindow(shareUrls.facebook)
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: <LinkedinOutlined style={{ color: '#0077b5' }} />,
      onClick: () => openShareWindow(shareUrls.linkedin)
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      icon: <WhatsAppOutlined style={{ color: '#25D366' }} />,
      onClick: () => openShareWindow(shareUrls.whatsapp)
    },
    {
      type: 'divider'
    },
    {
      key: 'copy',
      label: 'Copy Link',
      icon: copied ? <CheckOutlined style={{ color: '#52c41a' }} /> : <CopyOutlined />,
      onClick: copyToClipboard
    }
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomLeft" trigger={['click']}>
      <Tooltip title="Share your results">
        <Button 
          icon={<ShareAltOutlined />} 
          type="default"
        >
          Share Results
        </Button>
      </Tooltip>
    </Dropdown>
  );
};

export default SocialShare;