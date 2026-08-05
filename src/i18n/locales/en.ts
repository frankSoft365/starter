export default {
    btn: {
        cancel: 'Cancel',
        write: 'Write',
        home: 'Home',
        profile: 'Profile',
        publish: 'Publish',
        change: 'Change preview image',
        adjust: 'Adjust image',
        done: 'Done',
        resetToCenter: 'Reset to center',
        save: 'Save',
        favorite: 'Save',
        notInterested: "I'm not interested in this story",
        more: 'More',
        clap_one: '{{count}} clap',
        clap_other: '{{count}} claps',
        response_one: '{{count}} response',
        response_other: '{{count}} responses',
        repost_one: '{{count}} repost',
        repost_other: '{{count}} reposts',
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
        },
        avatarDropdown: {
            settings: 'Settings',
            logout: 'Logout'
        },
        updateBtn: 'Update',
        discardDraftsBtn: 'Discard drafts',
        loginBtn: 'Login'
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
    }
};