function makeClient() {
  const transport = new Thrift.Transport('https://aurora-atla.twitter.biz/api');
  const protocol = new Thrift.Protocol(transport);
  return new ReadOnlySchedulerClient(protocol);
}

export default makeClient();
