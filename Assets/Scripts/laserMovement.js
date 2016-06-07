#pragma strict

var laserspeed : float = 0.055;
var destroyNow : boolean = false;
var stopped : boolean = false;
var isEnemyLaser : boolean = false;

function Start () {

}

function Update () {
	if(destroyNow)
		Destroy(this.gameObject);
	if(!stopped)
		this.transform.position += this.transform.up * laserspeed;
}

function OnBecameInvisible()
{
	Destroy(this.gameObject);
}

function OnTriggerEnter2D(other : Collider2D)
{
	if(other.tag == "Player" && isEnemyLaser)
	{
		this.GetComponent(Animator).SetBool("Impact", true);
		this.gameObject.transform.rotation = Quaternion.Euler(0, 0, Random.Range(0, 360));
		Instantiate(GameObject.Find("WorldScript").GetComponent(worldGame).playerExplosion, other.gameObject.transform.position, Quaternion.Euler(0, 0, Random.Range(0, 360)));
		GameObject.Find("WorldScript").GetComponent(worldGame).SubtractLife();
		Destroy(other.gameObject);
	}
	else return;
}