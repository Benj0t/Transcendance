export class PacketInKeepAlive {
	
	public y_pcent: number;
	public timestamp: number;

	public PacketInKeepAlive(y_pcent: number) {
		this.y_pcent = y_pcent;
		this.timestamp = Date.now();
	}

}