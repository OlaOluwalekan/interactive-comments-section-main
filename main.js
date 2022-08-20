// DOM variables declaration
const postsContainer = document.querySelector(".posts-container");
const postTemplate = document.querySelector("[user-post-template]");

// whenevr window loads
window.onload = () => {
  LoadUserDetails(); // loads the current user details and add image to send box
  FetchPosts(); // fetches all the post from data.json
  // AddEvents();
};

// loads current user details and add image to send box
const LoadUserDetails = () => {
  const userImageHolder = document.querySelector(".send-msg img");
  fetch("./data.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const userImage = data.currentUser.image.webp;
      userImageHolder.src = userImage;
    });
};

// template is created in conjuction with html template
const AddToTemp = (post, type, owner, to, ownerList) => {
  const postContainer = postTemplate.content.cloneNode(true).children[0];
  const userImage = postContainer.querySelector(".user-header img");
  const userName = postContainer.querySelector(".user-name");
  const postTime = postContainer.querySelector(".msg-time");
  const postMsg = postContainer.querySelector(".msg-content");
  const replyTo = postContainer.querySelector(".reply-to");
  const youTag = postContainer.querySelector(".current-user");
  const action1 = postContainer.querySelector(".action-img1");
  const action2 = postContainer.querySelector(".action-img2");
  const userAction1 = postContainer.querySelector(".action-img1 img");
  const userActionText1 = postContainer.querySelector(".action-img1 p");
  const userAction2 = postContainer.querySelector(".action-img2 img");
  const userActionText2 = postContainer.querySelector(".action-img2 p");

  // if (type === "main") {
  // checks if it is a main post or reply to a post
  userImage.src = post.user.image.webp;
  userName.textContent = post.user.username;
  postTime.textContent = post.createdAt;
  postMsg.textContent = post.content;
  youTag.textContent = owner;
  replyTo.textContent = to;

  // adding class to necessary templates
  postContainer.classList.add(type);
  youTag.classList.add(ownerList);

  if (owner == "you") {
    userAction1.src = "./images/icon-delete.svg";
    userAction2.src = "./images/icon-edit.svg";
    userActionText1.textContent = "Delete";
    userActionText2.textContent = "Edit";

    AddEvents(action1, "DeletePost()");
    AddEvents(action2, "EditPost(this)");
  } else {
    userAction2.src = "./images/icon-reply.svg";
    userActionText2.textContent = "Reply";

    AddEvents(action2, "ReplyPost()");
  }

  // console.log(post);
  postsContainer.append(postContainer);
};

// load fetched post to the browser DOM using the templates created earlier
const LoadPosts = (data) => {
  let usersComments = data.comments;
  usersComments.forEach((userComment) => {
    if (userComment.user.username == "juliusomo") {
      if (userComment.hasOwnProperty("replyingTo")) {
        AddToTemp(userComment, "main-post", "you", "@" + userComment.replyTo);
      } else {
        AddToTemp(userComment, "main-post", "you", "");
      }
    } else {
      if (userComment.hasOwnProperty("replyingTo")) {
        console.log(userComment.replyingTo);
        AddToTemp(userComment, "main-post", "", "@" + userComment.replyTo);
      } else {
        AddToTemp(userComment, "main-post", "", "");
      }
    }

    if (
      userComment.hasOwnProperty("replies") &&
      userComment.replies.length != 0
    ) {
      //checks if each post has replies and loads the replies too
      let replies = userComment.replies;
      replies.forEach((reply) => {
        if (reply.user.username == "juliusomo") {
          if (reply.hasOwnProperty("replyingTo")) {
            AddToTemp(
              reply,
              "reply-post",
              "you",
              "@" + reply.replyingTo,
              "owner-class"
            );
          } else {
            AddToTemp(reply, "reply-post", "you", "", "owner-class");
          }
        } else {
          if (reply.hasOwnProperty("replyingTo")) {
            AddToTemp(
              reply,
              "reply-post",
              "",
              "@" + reply.replyingTo,
              "not-owner-class"
            );
          } else {
            AddToTemp(reply, "reply-post", "", "", "not-owner-class");
          }
        }
      });
    }
  });
};

// fetches the posts from data.json and passes it to LoadPosts to populate
const FetchPosts = () => {
  fetch("./data.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      LoadPosts(data);
    });
};

// Add event listeners to buttons
const AddEvents = (action, event) => {
  action.setAttribute("onclick", event);
};

// Delete post
function DeletePost() {
  const deleteDialog = document.querySelector(".dialog");
  const overlay = document.querySelector(".overlay");
  const cancelDialog = document.querySelector(".btn1");

  overlay.style.display = "flex";
  deleteDialog.style.transform = "scale(1)";
  // alert("delete");
  cancelDialog.onclick = () => {
    deleteDialog.style.transform = "scale(0)";
    overlay.style.display = "none";
  };
}

// Editing a post
function EditPost() {
  alert("edit");
}

// Replying a post
function ReplyPost() {
  alert("reply");
}
