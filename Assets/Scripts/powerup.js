#pragma strict

private var moveDirection : Vector3;
private var flipRotation : boolean;
var moveSpeed : float = 0.01;
var powerupType : int = 0;

function Start () {
	if(Random.Range(0, 10) < 5)
		flipRotation = true;
	moveDirection = this.transform.up;
}

function Update () {

	this.transform.position += moveDirection * moveSpeed;
	if(flipRotation)
		this.transform.Rotate(Vector3(0, 0, -1) * 0.75);
	else
		this.transform.Rotate(Vector3(0, 0, 1) * 0.75);
}

function OnTriggerEnter2D(other : Collider2D)
{
	if(other.tag == "Player")
	{
		GameObject.Find("WorldScript").GetComponent(worldGame).ActivatePowerup(powerupType);
		Destroy(this.gameObject);
	}
	else
		return;
}