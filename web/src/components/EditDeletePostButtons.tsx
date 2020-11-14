import React from "react";
import { IconButton, Link } from "@chakra-ui/core";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  id : number;
  creatorId : number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({id,creatorId}) => {
  const [deletePost] = useDeletePostMutation()
  const { data : meData } = useMeQuery();
  if(meData?.me?.id !== creatorId){
    return null
  }
  return (
    <>
      <NextLink href="/post/edit/[postId]" as={`/post/edit/${id}`}>
        <IconButton 
        as={Link}
          ml={2}
          mr="auto"
          icon="edit" 
          aria-label="ویرایش"
        ></IconButton>
      </NextLink>
      <IconButton 
        mr="auto"
        icon="delete" 
        aria-label="حذف"
        onClick={() => {
          deletePost({
            variables : {id},
            update: (cache) => {
              // Post:77
              cache.evict({ id: "Post:" + id });
            },
          })
        }}
      ></IconButton>
    </>
  );
};
