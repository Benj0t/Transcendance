export class PacketInKeepAlive {
	
	public y_pcent: number;
	public timestamp: number;
	public userid: number;

	constructor (y_pcent: number, user_id: number) {
		this.y_pcent = y_pcent;
		this.timestamp = Date.now();
		this.userid = user_id;
	}

}