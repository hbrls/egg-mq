module.exports = app => {
  return class Foo extends app.Service {
    async bar(topic, payload) {
      console.log(topic, payload);

      // const { ctx } = this;
      // const { res } = await ctx.curl('https://httpbin.org/post', {
      //   method: 'POST',
      //   contentType: 'json',
      //   data: payload,
      //   dataType: 'json',
      // });
      // console.log(res);
    }
  };
}
