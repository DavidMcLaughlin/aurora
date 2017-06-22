function makeClient() {
  const transport = new Thrift.Transport('https://aurora-smf1.twitter.biz/api');
  const protocol = new Thrift.Protocol(transport);
  return new ReadOnlySchedulerClient(protocol);
}

export default makeClient();
