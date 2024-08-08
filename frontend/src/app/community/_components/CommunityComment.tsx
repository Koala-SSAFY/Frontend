'use client'

import { useState } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import Comment from '/public/icons/comment.svg'
import CommunityCommentInput from '@/app/community/_components/CommunityCommentInput'
import CommunityPostKebabMenu from '@/app/community/_components/CommunityPostKebabMenu'
import { getConvertedTime } from '@/app/utils/getConvertedTime'
import { CommentContent, CommunityComment, getPost } from '@/app/apis/community'
import Pagination from '@/app/community/_components/CommunityCommentPagination'

interface CommnunityCommentProps {
  commentList: CommunityComment
  postId: number
}

const fetcher = (url: string) => getPost(url)

export default function CommnunityComment({
  commentList: commentList_,
  postId,
}: CommnunityCommentProps) {
  const [commentPage, setCommentPage] = useState(0)
  const {
    data: commentList,
    error,
    isLoading,
  } = useSWR(
    `/boards/${postId}/comments?page=${commentPage}&size=10`,
    fetcher,
    { fallbackData: commentList_ }
  )

  const handleChangeCommentPage = (newPage: number) => {
    setCommentPage(newPage)
  }

  const handleClickDeleteButton = () => {
    alert('게시글 댓글 삭제 버튼을 클릭했습니다')
  }

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center text-gray-900 text-base gap-3">
        <p>로딩중...</p>
      </div>
    )
  }

  return (
    <div className="w-full flex-col flex items-center">
      <div className="mb-5 py-5 px-12 flex items-center gap-2 w-full border-b-2 border-gray-300">
        <Comment width={20} height={20} />
        <p className="text-base text-gray-900 font-normal">
          댓글 {commentList?.comments?.totalElements || 0}
        </p>
      </div>
      <div className="flex flex-col items-center px-auto mb-10 w-full">
        {commentList?.comments?.content?.length > 0 ? (
          <>
            {commentList?.comments?.content?.map((comment: CommentContent) => (
              <div
                key={comment.commentId}
                className="max-w-[56rem] w-full flex py-6 px-6 items-start gap-3 border-b border-gray-300"
              >
                <Image
                  src={'/images/koala-sleep.png'}
                  width={0}
                  height={0}
                  sizes="100%"
                  className="w-[3rem] h-[3rem] aspect-square border rounded-full"
                  alt="profile"
                />
                <div className="w-full flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      <p className="text-gray-900 font-medium text-sm">
                        {comment.nickname}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <p className="text-gray-400 text-sm font-normal">
                        {getConvertedTime(comment.createdAt)}
                      </p>
                      <CommunityPostKebabMenu
                        size={{ width: 16, height: 16 }}
                        onClick={handleClickDeleteButton}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-900 text-base font-normal break-all">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <Pagination
              totalPages={commentList?.comments?.totalPages}
              onPageChange={handleChangeCommentPage}
              selectedCommentPage={commentPage}
            />
          </>
        ) : (
          <div className="py-20 flex flex-col items-center text-gray-900 text-base gap-3">
            <p>아직 댓글이 없습니다</p>
            <p>처음으로 댓글을 달아보세요</p>
          </div>
        )}
      </div>

      <div className="w-full max-w-[56rem]">
        <CommunityCommentInput
          postId={postId}
          selectedCommentPage={commentPage}
        />
      </div>
    </div>
  )
}
