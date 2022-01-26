import { helloblog } from "../../declarations/helloblog";



new Vue({
  el: '#app',
  data: {
    visible: false,
    tipVis:  false,
    pswd:'',
    tips: '',
    people:'',
    message:'',
    followList: [],
    msgList: [],
    fullscreenLoading: false,
    followMsgList:[],
  },
  mounted: async function() {
    const msgList = await helloblog.posts(0);
      msgList.map((el)=>{
        el.time = new Date(Number(el.time)/1000000).toLocaleString()
      })
      console.log(msgList)
      this.msgList = msgList

      const followList = await helloblog.follows();
      this.followList = followList
      console.log(followList)
  },
  methods: {
    
    post:  async function () {
      this.fullscreenLoading = true;
      const message = this.message
      if(message.length<1) {
        this.tips = '内容为空！'
      } else {
        const pswd = this.pswd
        try {
          await helloblog.post(pswd, message);
          
          this.tips = '发帖成功！'
          const msgList = await helloblog.posts(0);
          msgList.map((el)=>{
            el.time = new Date(Number(el.time)/1000000).toLocaleString()
          })
          console.log(msgList)
          this.msgList = msgList
        } catch(error) {
          console.log(error)
          this.tips = '失败！'
        }
      }
      this.fullscreenLoading = false;
      this.tipVis = true
    },
    load_posts:  async function (f) {

      this.fullscreenLoading = true;

      try {
        const msgList = await helloblog.postsByPrincp(f,0);
        msgList.map((el)=>{
          el.time = new Date(Number(el.time)/1000000).toLocaleString()
        })
        this.followMsgList = msgList
      } catch (error) {
        this.tips = '失败！'
        this.tipVis = true
        return;
      }
      

      this.fullscreenLoading = false;
      this.visible = true

      
    },
    follow:  async function () {
      this.fullscreenLoading = true;
      const people = this.people
      if(people.length<1) {
        this.tips = '不能为空！'
      } else {
        try {
          await helloblog.follow(people);
          this.tips = '关注成功！'
        } catch(error) {
          console.log(error)
          this.tips = '关注失败！'
        }
      }
      this.fullscreenLoading = false;
      this.tipVis = true
    },
  }
})