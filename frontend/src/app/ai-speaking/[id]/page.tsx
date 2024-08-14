'use client'

import ChatBubble from '@/app/_components/ChatBubble'
import MicBtn from '/public/icons/microphone.svg'
import SendBtn from '/public/icons/send.svg'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import AISpeakingBackgroundLayout from '@/app/ai-speaking/_components/AISpeakingBackgroundLayout'
import { useParams, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import { getStartAISpeaking } from '@/app/apis/ai-speaking'

type TopicKey = '일상' | '행정' | '교육'

const BACKGROUND_DATA: Record<TopicKey, { bgImage: string; avatar: string }> = {
  일상: {
    bgImage: '/images/daily-background.jpg',
    avatar: '/images/koala-front.png',
  },
  행정: {
    bgImage: '/images/administration-background.jpg',
    avatar: '/images/koala-business.png',
  },
  교육: {
    bgImage: '/images/education-background.jpg',
    avatar: '/images/koala-study.png',
  },
}

interface AISpeakingMessage {
  sender: string
  message: string
  isMine: boolean
}

export default function AISpeakingLearningRoom() {
  const [isSpeakMode, setIsSpeakMode] = useState(true)
  const [messages, setMessages] = useState<AISpeakingMessage[]>([])
  const searchParams = useSearchParams()
  const topic = searchParams.get('topic') as TopicKey
  const params = useParams()
  const { id } = params
  const { data: startData } = useSWR(
    `/ai-talk/start?situation=${id}`,
    getStartAISpeaking
  )

  useEffect(() => {
    if (startData?.data && messages.length === 0) {
      setMessages([
        {
          sender: startData.data.ai_role,
          message: startData.data.message,
          isMine: false,
        },
      ])
    }
  }, [startData])

  return (
    <AISpeakingBackgroundLayout>
      <div className="h-main-screen flex items-center">
        <div className="h-[90%] w-[80%] max-w-7xl bg-white rounded-3xl mx-auto flex gap-10 p-8">
          <div className="relative bg-gray-300 rounded-tr-3xl overflow-hidden w-[50%] ">
            <Image
              src={BACKGROUND_DATA[topic].bgImage}
              width={500}
              height={500}
              alt="background"
              className="w-full h-full object-cover blur-sm"
              priority
            />
            <Image
              src={BACKGROUND_DATA[topic].avatar}
              alt="koala-front"
              width={300}
              height={300}
              className="absolute bottom-12 left-36"
            />
          </div>
          <div className="w-[50%] flex flex-col gap-12 items-center justify-between">
            <div className="w-full overflow-auto pr-3 flex-1 flex flex-col gap-2">
              {messages.map((chat, idx) => (
                <ChatBubble
                  key={idx}
                  isMine={chat.isMine}
                  message={chat.message}
                  senderName={chat.sender}
                  senderProfile={BACKGROUND_DATA[topic].avatar}
                />
              ))}
            </div>
            <div className="w-full text-center">
              {isSpeakMode ? (
                <button>
                  <MicBtn className="w-16 text-primary-400" />
                </button>
              ) : (
                <div className="flex gap-3">
                  <input type="text" className="input" />
                  <button className="w-16 text-white bg-primary-400 rounded-full p-3">
                    <SendBtn />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AISpeakingBackgroundLayout>
  )
}
