Component({
    properties: {
        real: {
            type: Object,
            value: {}
        }
    },
    methods: {
        
    },
    lifetimes: {
        attached: function() {
        },
        detached: function() {
            // 在组件实例被从页面节点树移除时执行
        }
    }
})