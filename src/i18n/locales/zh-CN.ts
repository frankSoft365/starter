export default {
    btn: {
        cancel: '取消',
        write: '写文章',
        home: '主页',
        profile: '个人主页',
        publish: '发布',
        reply: '回复',
        change: '修改封面图',
        adjust: '调整图片裁剪',
        done: '确定',
        resetToCenter: '重置为居中',
        save: '保存',
        favorite: '收藏',
        settings: '设置',
        logout: '退出登录',
        login: '登录',
        update: '保存修改',
        discardDrafts: '清空草稿',

        share: '分享',
        copyLink: '复制链接',
        shareOnX: '分享到 X',

        notInterested: '不感兴趣',
        more: '更多',
        clapIsOwn: '你不能给自己的文章点赞',
        clap_one: '{{count}} 点赞',
        clap_other: '{{count}} 点赞',
        respond: '回复',
        response_one: '{{count}} 回复',
        response_other: '{{count}} 回复',
        repostIsOwn: '你不能转发自己的文章',
        repost_one: '{{count}} 转发',
        repost_other: '{{count}} 转发',
        editArticle: '编辑文章',
        deleteArticle: '删除文章',
    },
    badge: {
        author: '作者'
    },
    common: {
        loading: '加载中...',
        loadingMore: '加载更多中...',
        error: '错误',
        retry: '重试',
        toast: {
            replyPosted: '回复已发布，查看完整讨论以查看。',
            publishError: '发布文章时发生错误。',
            noFileSelected: '未选择文件',
            featureNotAvailable: '功能尚未开放',
        }
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
        }
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
    },
    account: {
        validate: {
            usernameRequired: '用户名不能为空',
            usernameLength: '用户名长度需在 6 到 20 个字符之间',
            usernameRegex: '用户名格式不正确',
        }
    },
    auth: {
        validate: {
            passwordRequired: '密码不能为空',
            passwordLength: '密码长度需在 6 到 20 个字符之间',
            passwordRegex: '密码格式不正确',
        }
    },
    settings: {
        page: {
            title: '设置',
            profile: '个人资料',
            email: '邮箱地址',
            username: '用户名',
            photo: '头像',
            account: '账户',
            changePassword: '修改密码',
            fetchError: '获取用户信息失败',
        },
        modal: {
            profileInfo: '个人资料信息',
            update: '修改',
            remove: '移除',
            close: '关闭',
            uploadHint: '建议：方形 JPG、PNG 或 GIF，边长至少 1000 像素。',
        },
        changePassword: {
            title: '修改密码',
            description: '输入您当前的密码和一个新密码。',
            currentPassword: '当前密码',
            newPassword: '新密码',
            placeholder: '密码',
            save: '保存',
        },
        toast: {
            updateSuccess: '更新成功',
            passwordChanged: '密码修改成功',
            avatarUploaded: '头像上传成功',
            logoutSuccess: '退出登录成功',
            nothingToUpdate: '没有需要更新的内容',
            samePassword: '新旧密码相同',
        },
    },
    notification: {
        title: '通知中心',
        tab: {
            reply: '回复',
            like: '点赞',
            follow: '关注',
        },
        action: {
            commentedArticle: '评论了我的文章',
            repliedComment: '回复了我的评论',
        },
        replyTo: '回复',
        relatedArticle: '相关文章：',
        relatedRootComment: '相关根评论：',
        watermark: '上次看到这里',
        empty: '该分类暂时没有通知。',
        noMore: '没有更多通知了。',
    },
    comment: {
        response_one: '回复({{count}})',
        response_other: '回复({{count}})',
        noAuth: '登录才能看评论区',
        noComment: '还没有评论哦',
        noMoreComment: '没有更多评论了',
        showMore: '展开更多评论',
        replyTo: '回复',
        commentInput: {
            placeholder: '勇敢滴少年啊快去创造热评～',
            replyTo: '回复@{{username}}'
        },
        expand_one: '共{{count}}条评论，点击展开',
        expand_other: '共{{count}}条评论，点击展开',
        collapse: '点击收起',
        validate: {
            commentRequired: '你还没有评论！',
            commentMax: '评论字数不能超过2000'
        }
    }
};