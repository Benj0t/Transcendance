export class PacketInKeepAlive {
	
	public yPcent: number;
	public timestamp: number;
	public userid: number;

	constructor (y_pcent: number, user_id: number) {
		this.yPcent = y_pcent;
		this.timestamp = Date.now();
		this.userid = user_id;
	}

}