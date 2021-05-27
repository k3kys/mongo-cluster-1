rsconf = {
    _id : "cgfrs",
    configsvr: true,
    members: [
      { _id : 0, host : "15.164.251.138:40001" },
      { _id : 1, host : "15.164.129.191:40002" },
      { _id : 2, host : "13.209.43.198:40003" }
    ]
  }
  
rs.initiate(rsconf)

rs.status()
