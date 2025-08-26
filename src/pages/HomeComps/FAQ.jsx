import { Disclosure } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'

const faqs = [
    {
      question: "What is the difference between the Beginner, Advanced, and Ultimate plans?",
      answer: "The Beginner plan provides essential tools to kickstart your Japanese learning journey. The Advanced plan includes comprehensive resources and interactive tools to enhance your skills. The Ultimate plan offers all-inclusive access to all features, including advanced analytics and personalized support."
    },
    {
      question: "Can I switch my subscription plan later?",
      answer: "Yes, you can upgrade or downgrade your subscription plan at any time through your account settings. The changes will take effect immediately, and you will be billed accordingly."
    },
    {
      question: "Do I need any prior knowledge of Japanese to use this platform?",
      answer: "No prior knowledge is necessary. Our platform is designed to accommodate learners at all levels, from complete beginners to advanced speakers."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a 7-day free trial for all new users. This allows you to explore our features and see if the platform meets your learning needs before committing to a subscription."
    },
    {
      question: "How does the AI chat practice work?",
      answer: "Our AI chat practice feature simulates real-life conversations in Japanese. You can engage in dialogues with the AI, which provides real-time corrections and suggestions to help improve your speaking skills."
    },
    {
      question: "Can I access the resources offline?",
      answer: "Yes, many of our resources are downloadable for offline use. This includes vocabulary lists, grammar guides, and Kanji practice sheets, so you can study anytime, anywhere."
    },
    {
      question: "What types of educational games are available?",
      answer: "We offer a variety of games designed to make learning fun and engaging. This includes Master Mind, card games for guessing Kanji or words, and typing speed challenges. These games help reinforce your knowledge and track your progress."
    },
    {
      question: "How can I track my progress?",
      answer: "Our interactive dashboards provide detailed analytics on your learning progress. You can monitor your achievements, track milestones, and receive customized reports on your strengths and areas for improvement."
    },
    {
      question: "Is there a community or support group I can join?",
      answer: "Yes, we have a vibrant community of learners where you can share tips, resources, and motivation. You can participate in forums, group studies, and attend virtual meetups to connect with other learners and experienced teachers."
    },
    {
      question: "What happens if I miss a lesson or practice session?",
      answer: "Our platform is flexible and allows you to learn at your own pace. If you miss a lesson or practice session, you can easily catch up by accessing the recorded sessions and materials at any time."
    }
  ];
  

export default function FAQS() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Frequently asked questions</h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                        <span className="text-base font-semibold leading-7">{faq.question}</span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                          ) : (
                            <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base leading-7 text-gray-600 text-left">{faq.answer}</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
