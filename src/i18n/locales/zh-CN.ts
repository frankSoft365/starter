export default {
    btn: {
        cancel: '取消',
        write: '写文章',
        home: '主页',
        profile: '个人主页',
        publish: '发布',
        change: '修改封面图',
        adjust: '调整图片裁剪',
        done: '确定',
        resetToCenter: '重置为居中',
        save: '保存',
        favorite: '收藏',
        notInterested: '不感兴趣',
        more: '更多',
        clap_one: '{{count}} 点赞',
        clap_other: '{{count}} 点赞',
        response_one: '{{count}} 回复',
        response_other: '{{count}} 回复',
        repost_one: '{{count}} 转发',
        repost_other: '{{count}} 转发',
    },
    article: {
        validate: {
            titleRequired: "请输入标题",
            titleMax: "标题不能超过100个字符",
            subtitleMax: "副标题不能超过140个字符",
            topicRegex: "标签仅支持文字、数字、空格和短横线",
            topicMax: "单个标签最多25个字符",
            coverFocusYMin: "垂直焦点必须大于等于 0",
            coverFocusYMax: "垂直焦点必须小于等于 1"
        }
    },
    nav: {
        searchInput: {
            placeholder: '搜索'
        },
        notificationBell: {
            tooltip: '通知中心'
        },
        avatarDropdown: {
            settings: '设置',
            logout: '退出登录'
        },
        updateBtn: '保存修改',
        discardDraftsBtn: '清空草稿',
        loginBtn: '登录'
    },
    submission: {
        storyPreview: '文章预览',
        coverImage: {
            legend: '封面图',
            emptyDes: '在你的故事中加入一张高质量图片，使其对读者更具吸引力。',
            adjust: {
                legend: '调整图片',
                des: '拖动高亮显示的方框，选择裁剪后保留在画面中的区域。',
                preview: '调整后的预览',
            }
        },
        titleInput: {
            legend: '标题',
            placeholder: '写预览标题...'
        },
        subtitleInput: {
            legend: '副标题',
            placeholder: '写预览副标题...'
        },
        note: '注意：此处的更改将影响您的故事在 Aedium 首页等公开位置以及订阅者收件箱中的显示方式，而不会改变故事本身的内容。',
        topicsInput: {
            legend: '话题',
            des: '添加最多五个话题，帮助读者找到您的故事。',
            placeholderEmpty: '添加一个话题...',
            placeholderHasItem: '添加更多话题...'
        }

    }
};