export default {
    btn: {
        cancel: 'Cancel',
        write: 'Write',
        home: 'Home',
        profile: 'Profile',
        publish: 'Publish',
        reply: 'Reply',
        change: 'Change preview image',
        adjust: 'Adjust image',
        done: 'Done',
        resetToCenter: 'Reset to center',
        save: 'Save',
        favorite: 'Save',
        settings: 'Settings',
        logout: 'Logout',
        login: 'Login',
        update: 'Update',
        discardDrafts: 'Discard drafts',

        share: 'Share',
        copyLink: 'Copy link',
        shareOnX: 'Share on X',

        notInterested: "I'm not interested in this story",
        more: 'More',
        clapIsOwn: 'Your cannot applaud your own story',
        clap_one: '{{count}} clap',
        clap_other: '{{count}} claps',
        respond: 'Respond',
        response_one: '{{count}} response',
        response_other: '{{count}} responses',
        repostIsOwn: 'Your cannot repost your own story',
        repost_one: '{{count}} repost',
        repost_other: '{{count}} reposts',
        editArticle: 'Edit story',
        deleteArticle: 'Delete story',
    },
    badge: {
        author: 'Author'
    },
    common: {
        loading: 'Loading...',
        loadingMore: 'Loading more...',
        error: 'Error',
        retry: 'Retry',
        toast: {
            replyPosted: 'Reply posted — view the full thread to see it.',
            publishError: 'An error occurred while publishing the article.',
            noFileSelected: 'No file selected',
            featureNotAvailable: 'Feature not available yet',
        }
    },
    article: {
        validate: {
            titleRequired: "Please enter a title",
            titleMax: "The title cannot exceed 100 characters.",
            subtitleMax: "The subtitle cannot exceed 140 characters.",
            topicRegex: "Tags only support letters, numbers, spaces and dashes.",
            topicMax: "A tag name must be 25 characters max.",
            coverFocusYMin: "coverFocusY must be >= 0",
            coverFocusYMax: "coverFocusY must be <= 1"
        }
    },
    nav: {
        searchInput: {
            placeholder: 'Search'
        },
        notificationBell: {
            tooltip: 'Notifications'
        }
    },
    submission: {
        storyPreview: 'Story preview',
        coverImage: {
            legend: 'Cover image',
            emptyDes: 'Include a high-quality image in your story to make it more inviting to readers.',
            adjust: {
                legend: 'Adjust image',
                des: 'Drag the highlighted box to choose what stays in view when cropped.',
                preview: 'Link preview',
            }
        },
        titleInput: {
            legend: 'Title',
            placeholder: 'Write a preview title...'
        },
        subtitleInput: {
            legend: 'Subtitle',
            placeholder: 'Write a preview subtitle...'
        },
        note: 'Note: Changes here will affect how your story appears in public places like Aedium’s homepage and in subscribers’ inboxes — not the contents of the story itself.',
        topicsInput: {
            legend: 'Topics',
            des: 'Add up to five topics to help readers find your story.',
            placeholderEmpty: 'Add a topic...',
            placeholderHasItem: 'Add more topics...'
        }
    },
    account: {
        validate: {
            usernameRequired: 'Username is required',
            usernameLength: 'Username must be between 6 and 20 characters',
            usernameRegex: 'Username does not match required format',
        }
    },
    auth: {
        validate: {
            passwordRequired: 'Password is required',
            passwordLength: 'Password must be between 6 and 20 characters',
            passwordRegex: 'Password does not match required format',
        }
    },
    settings: {
        page: {
            title: 'Settings',
            profile: 'Profile',
            email: 'Email address',
            username: 'Username',
            photo: 'Photo',
            account: 'Account',
            changePassword: 'Change Password',
            fetchError: 'Failed to retrieve user information',
        },
        modal: {
            profileInfo: 'Profile information',
            update: 'Update',
            remove: 'Remove',
            close: 'Close',
            uploadHint: 'Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per side.',
        },
        changePassword: {
            title: 'Change Password',
            description: 'Enter your current password and a new password.',
            currentPassword: 'Current Password',
            newPassword: 'New Password',
            placeholder: 'Password',
            save: 'Save',
        },
        toast: {
            updateSuccess: 'Updated successfully',
            passwordChanged: 'Password changed successfully',
            avatarUploaded: 'Avatar uploaded successfully',
            logoutSuccess: 'Logout successful',
            nothingToUpdate: 'Nothing to update',
            samePassword: 'The old and new passwords are the same.',
        },
    },
    notification: {
        title: 'Notifications',
        tab: {
            reply: 'Reply',
            like: 'Like',
            follow: 'Follow',
        },
        action: {
            commentedArticle: 'commented to my article',
            repliedComment: 'reply to my comment',
        },
        replyTo: 'reply to',
        relatedArticle: 'related article :',
        relatedRootComment: 'related rootComment :',
        watermark: 'Last time I saw this',
        empty: 'There are no notifications for this category yet.',
        noMore: 'No more notifications.',
    },
    comment: {
        response_one: 'Response({{count}})',
        response_other: 'Responses({{count}})',
        noAuth: 'You need to login to view comments.',
        noComment: 'There are currently no responses for this story. Be the first to respond.',
        noMoreComment: 'No more comments.',
        showMore: 'Show more replies',
        replyTo: 'reply to',
        commentInput: {
            placeholder: 'What are your thoughts?',
            replyTo: 'Replying to @{{username}}'
        },
        expand_one: 'Total {{count}} reply, click to expand',
        expand_other: 'Total {{count}} replies, click to expand',
        collapse: 'Click to collapse',
        validate: {
            commentRequired: 'Comment is required.',
            commentMax: 'Comment must be at most 2000 characters'
        }
    }
};