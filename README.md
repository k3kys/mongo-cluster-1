# docker로 mongo-clustering 구현하
## 왜 cluster인가?
저번에 docker로 mongo-replicaset을 구현해보았습니다.
레플리카셋을 통해 하나의 서버 안에서 세 개의 디비 컨테이너가 동작하며
하나의 컨테이너가 다운되도 나머지 컨테이너가 살아있다면 디비 서버가 동작하는데 아무 이상이 없었습니다.

**하지만**
아예 해당 디비 서버가 다운 된다면 replica-set은 의미가 없어지게 됩니다.
따라서, 디비를 클러스터링 하여 하나의 디비 서버가 다운 되더라도 나머지 서버가 살아있다면 잘 동작할 수 있도록
가용성을 높였습니다.


## 개념
<img src="https://user-images.githubusercontent.com/56282663/119774164-bb661e80-befc-11eb-8d9c-9ed7675c6b3b.png"/>

mongos : 라우터의 역할로 사용자가 접속하는 포인트로 쿼리를 받아 config server의 분산 정보를 참조하여 샤드로 전달해 주고 사용자들에게 결과를 리턴해주는 역할

config server : 샤드 클러스터에서 분산된 샤드 정보를 저장하고 관리

sharded server : 데이터가 실제 저장되는 곳

컨피그 서버와 샤드 서버의 경우 다 레플리카 셋으로 구성하였습니다.

실제로 서버1의 프라이머리가 죽으면 서버2나 3의 세컨더리들이 프라이머리가 됩니다.

## 구성
1. mongo-cluster-1, mongo-cluster-2, mongo-cluster-3의 컨피그 컨테이너가 모두 돌아간다면, 

컨피그 서버1로 접속하여 레플리카셋을 구성해야 합니다.

```
$ mongo mongodb://<서버1ip>:<포트>
rs.initiate(
  {
    _id: "cfgrs",
    configsvr: true,
    members: [
      { _id : 0, host : "<서버1ip>:40001" },
      { _id : 1, host : "<서버2ip>:40002" },
      { _id : 2, host : "<서버3ip>:40003" }
    ]
  }
)

rs.status()
```

2. mongo-cluster-1, mongo-cluster-2, mongo-cluster-3의 샤드 컨테이너가 모두 돌아간다면, 

샤드 서버1로 접속하여 레플리카셋을 구성해야 합니다.

```
$ mongo mongodb://<서버1ip>:50001
rs.initiate(
  {
    _id: "shard1rs",
    members: [
      { _id : 0, host : "<서버1ip>:50001" },
      { _id : 1, host : "<서버2ip>:50002" },
      { _id : 2, host : "<서버3ip>:50003" }
    ]
  }
)

rs.status()
```

3.mongos 라우터를 구성했다면, mongos에 들어가 구성한 샤드클러스터들을 등록해줘야합니다.

```
$ mongo mongodb://<mongos가 구성된 서버 ip>:60000

mongos> sh.addShard("shard2rs/192.168.1.81:50004,192.168.1.81:50005,192.168.1.81:50006")

mongos> sh.status()
```

참고: https://boying-blog.tistory.com/35
