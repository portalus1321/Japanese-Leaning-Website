
import images from "../../utils/LoadImage"

export default function Features() {
  const posts = [
    { 
      id: 1, 
      title: 'Interactive Dashboards:', 
      texts: [
        'Visualize your progress with detailed analytics.', 
        'Track your learning milestones and achievements.',
        'Customized reports to monitor your strengths and weaknesses.',
        'User-friendly interface for easy navigation.'
      ], 
      side: 2, 
      src: 'img1.jpg' 
    },
    { 
      id: 2, 
      title: 'Comprehensive Resources:', 
      texts: [
        'Access a wide range of study materials for levels N5 to N1.', 
        'Includes vocabulary lists, grammar guides, and Kanji practice.',
        'Regular updates to ensure up-to-date content.', 
        'Downloadable resources for offline study.'
      ], 
      side: 1, 
      src: 'img2.jpg' 
    },
    { 
      id: 3, 
      title: 'AI Chat Practice:', 
      texts: [
        'Engage in conversations with AI to improve your speaking skills.', 
        'Tailored feedback to help you improve.',
        'Real-time corrections and suggestions.', 
        'Simulate real-life conversations in Japanese.'
      ], 
      side: 2, 
      src: 'img3.jpg' 
    },
    { 
      id: 4, 
      title: 'Educational Games:', 
      texts: [
        'Play fun and interactive games designed to enhance your learning.', 
        'Includes Master Mind, card games, and typing speed challenges.',
        'Compete with friends and other learners.', 
        'Earn rewards and badges for your progress.'
      ], 
      side: 1, 
      src: 'img4.jpg' 
    },
    { 
      id: 5, 
      title: 'Real-time Notifications:', 
      texts: [
        'Stay updated with instant notifications about new lessons.', 
        'Practice sessions and achievements.',
        'Never miss an update or event.', 
        'Customize notification settings to your preference.'
      ], 
      side: 2, 
      src: 'img5.jpg' 
    },
    { 
      id: 6, 
      title: 'Community Support:', 
      texts: [
        'Join a community of learners to share tips, resources, and motivation.', 
        'Participate in forums and group studies.',
        'Get help from experienced learners and teachers.', 
        'Attend virtual meetups and study groups.'
      ], 
      side: 1, 
      src: 'img6.jpg' 
    },
    { 
      id: 7, 
      title: 'Personalized Learning Paths:', 
      texts: [
        'Customize your learning journey based on your goals and progress.', 
        'Receive recommendations tailored to your skill level and interests.',
        'Adjust your learning pace to suit your schedule.', 
       
      ], 
      side: 2, 
      src: 'img7.jpg' 
    }
  ];

  return (
    <>
      <div className="w-full">
      <div  className="w-1/2 h-[20px] relative  left-1/2">
              <div className="absolute h-[10px] w-[8px]  rounded-t-full bg-gray-300 bottom-0 left-[-4px]">
              <div className="relative w-[4px] h-[8px] rounded-t-full top-[2px] bg-gray-700 left-[2px]">
               
              </div>
              </div>
            </div>
        {posts.map((post) => (
          post.side === 1 ? (
            <div key={post.id} className=" w-1/2 h-[300px] relative  left-0 ">
              <div className=" absolute w-[500px] h-[260px] top-[20px] right-[30px] rounded-lg bg-gray-300 ">
                 <div className=" absolute w-[492px] h-[252px] top-[4px] right-[4px] rounded-lg bg-gray-700 ">
                        <img className=" w-[484px] h-[244px] relative top-[4px] rounded-lg left-[4px] brightness-[0.2]" src={images[post.src]} alt="" />
                        <div className=" w-full h-full absolute top-0 left-0 p-6">
                           <h1 className=" relative left-0 text-left text-white text-xl drop-shadow-2xl">{post.title}</h1>
                           <ul className="mt-2">
                           {post.texts.map((item) => (
                            <li className="text-left list-disc text-white ml-5 mt-2 drop-shadow-2xl">{item}</li>
                           ))}
                           </ul>
                          
                        </div>
                 </div>  
              </div>
              <div className="absolute h-full w-[8px] bg-gray-300 top-0 right-[-4px]">
                 <div className="relative w-[4px] h-full bg-gray-700 left-[2px]">
                 <div className="absolute w-[40px] h-[40px] top-[130px] bg-gray-300 left-[-18px] rounded-full">
                  <div className="absolute w-[36px] h-[36px] bg-gray-700 top-[2px] left-[2px] rounded-full">
                  
                  </div>
                </div>
                 </div>
              </div>
            </div>
          ) : (
            <div key={post.id} className="w-1/2 h-[300px] relative  left-1/2">
               <div className=" absolute w-[500px] h-[260px] top-[20px] left-[30px] rounded-lg bg-gray-300 ">
                 <div className=" absolute w-[492px] h-[252px] top-[4px] right-[4px] rounded-lg bg-gray-700 ">
                 <img className=" w-[484px] h-[244px] relative top-[4px] rounded-lg left-[4px] brightness-[0.4]" src={images[post.src]} alt="" />
                        <div className=" w-full h-full absolute top-0 left-0 p-6">
                           <h1 className=" relative left-0 text-left text-white text-xl">{post.title}</h1>
                           <ul className="mt-2">
                           {post.texts.map((item) => (
                            <li className="text-left list-disc text-white ml-5 mt-2">{item}</li>
                           ))}
                           </ul>
                          
                        </div>    </div>  
              </div>
              <div className="absolute h-full w-[8px] bg-gray-300 top-0 left-[-4px]">
              <div className="relative w-[4px] h-full bg-gray-700 left-[2px]">
                <div className="absolute w-[40px] h-[40px] top-[130px] bg-gray-300 left-[-18px] rounded-full">
                  <div className="absolute w-[36px] h-[36px] bg-gray-700 top-[2px] left-[2px] rounded-full">
                  
                  </div>
                </div>
              </div>
              </div>
            </div>
          )
        ))}
         <div  className="w-1/2 h-[20px] relative  left-1/2">
              <div className="absolute h-[10px] w-[8px]  rounded-b-full bg-gray-300 top-0 left-[-4px]">
              <div className="relative w-[4px] h-[8px] rounded-b-full bg-gray-700 left-[2px]">
               
              </div>
              </div>
            </div>
      </div>
    </>
  )
}
