import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useState } from "react";
import { Button, Icon, Confirm } from "semantic-ui-react";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import MyPopup from "../util/MyPopup";

function DeleteButton({ postId, callback, commentId }) {
	const [confirmOpen, setConfirmOpen] = useState(false);

	const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

	const [deletePostOrComment] = useMutation(mutation, {
		variables: { postId, commentId },
		update(proxy, _) {
			setConfirmOpen(false);

			if (!commentId) {
				const data = proxy.readQuery({
					query: FETCH_POSTS_QUERY,
				});
				data.getPosts = data.getPosts.filter((post) => post.id !== postId);
				proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
			} else {
			}

			if (callback) {
				callback();
			}
		},
		onError(err) {
			alert(err);
		},
	});

	return (
		<>
			<MyPopup content={commentId ? "Delete comment" : "Delete post"}>
				<Button
					as="div"
					color="red"
					floated="right"
					onClick={() => setConfirmOpen(true)}
				>
					<Icon style={{ margin: 0 }} name="trash" />
				</Button>
			</MyPopup>
			<Confirm
				open={confirmOpen}
				onCancel={() => setConfirmOpen(false)}
				onConfirm={deletePostOrComment}
			/>
		</>
	);
}

const DELETE_POST_MUTATION = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`;

const DELETE_COMMENT_MUTATION = gql`
	mutation deleteComment($postId: ID!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
			id
			comments {
				id
				username
				createdAt
				body
			}
			commentCount
		}
	}
`;

export default DeleteButton;
