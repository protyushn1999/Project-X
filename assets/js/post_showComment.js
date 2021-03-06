class PostComments{
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#postid-${postId}`); 
        this.newCommentForm = $(`#post-${postId}-comments-form`);  
        
        this.createComment(postId);
        let self = this;
        //call for all existing comments

        $(' .dropdown-item-del', this.postContainer).each(function() {
            self.deleteComment($(this));
        });
        
    }

    createComment(postId) {
        let pSelf = this;
        this.newCommentForm.submit(function(e) {
            e.preventDefault();
            console.log('inside comment btn');
            let self = this;

            $.ajax({
                type: 'POST',
                url: '/users/posts/createcomment',
                data: $(self).serialize(),
                success: function(data) {
                    console.log(data);
                    console.log(data.data.totalComments);
                    let newComment = pSelf.newCommentDOM(data.data.comment);
                    $('#commentNo').text(data.data.totalComments);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    console.log("SUCESSS in showing the comment in the DOM");
                    pSelf.deleteComment($(' .dropdown-item-del', newComment));
                    new Noty({
                        theme: 'sunset',
                        text: "Comment created successfully from ajax",
                        type: 'success',
                        layout: 'bottomRight',
                        timeout: 500
                        
                    }).show();
                },
                error: function(error) {
                    console.log(error.responseText);
                }
            });
        });
    }

    newCommentDOM(comment) {

        return $(`
       <div class="row" id="comment-${comment._id}">
            <div class="col-md-2 align-items-center">
                        <img src="${comment.user.avatar}" class="rounded-circle" alt="Cinque Terre" width="40" height="40">
            </div>

            <div class="col-md-8 text-start"  id="comment-${comment._id}">
                <h6>${comment.user.name}</h6>
                <p>${comment.content}</p>
            </div>

            <div class="col-md-2">
                <div class= "dropdown" >
                    <a class="dropdown-item-del delete-comment-button" href="/users/posts/deletecomment/${comment._id}"><i class="fas fa-trash-alt"> </i></a>
                </div>     
            </div>
        </div>
        
        `);
    }


    deleteComment(deleteLink) {
        $(deleteLink).click(function(e) {
            e.preventDefault();

            $.ajax({
                type: 'GET',
                url: $(deleteLink).prop('href'),
                success: function(data) {
                    console.log(data.data.totalComments);
                    $(`#comment-${data.data.comment_id}`).remove();
                    $('#commentNo').text(data.data.totalComments);
                    console.log("deleted the comment using ajax");
                    new Noty({
                        theme: 'sunset',
                        text: "Comment deleted successfully",
                        type: 'success',
                        layout: 'bottomRight',
                        timeout: 500
                        
                    }).show();
                },
                error: function(error) {
                    console.log(error.responseText);
                }
            });
        });
    }
}
