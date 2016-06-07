#pragma strict

var AsteroidHealth : int = 3;
var AsteroidSpeed : float = 0.011;
var ExplosionType : GameObject;
var scoreValue : int;
var canSpawnChunks : boolean = false;
var chunkTypes : GameObject[];
var chunkMin : int = 0;
var chunkMax : int = 3;

private var rotateRate : float;
private var flipRotation : boolean;
private var moveDirection : Vector3;

function Start () {
	if(Random.Range(0, 10) < 5)
		flipRotation = true;
	moveDirection = this.transform.up;
	rotateRate = Random.Range(0.6, 0.82);
}

function Update () {
	this.transform.position += moveDirection * AsteroidSpeed;
	if(flipRotation)
		this.transform.Rotate(Vector3(0, 0, -1) * rotateRate);
	else
		this.transform.Rotate(Vector3(0, 0, 1) * rotateRate);
}

function OnTriggerEnter2D(other : Collider2D)
{
	if(other.tag == "Asteroid" || other.tag == "AsteroidTiny" || other.tag == "Enemy" || other.tag == "EnemyLaser" || other.tag == "Powerup")
		return;
	if(other.tag == "PlayerLaser")
	{
		other.gameObject.GetComponent(Animator).SetBool("Impact", true);
		other.gameObject.transform.rotation = Quaternion.Euler(0, 0, Random.Range(0, 360));
	}
	else if(other.tag == "Player")
	{
		Instantiate(GameObject.Find("WorldScript").GetComponent(worldGame).playerExplosion, other.gameObject.transform.position, Quaternion.Euler(0, 0, Random.Range(0, 360)));
		GameObject.Find("WorldScript").GetComponent(worldGame).SubtractLife();
		Destroy(other.gameObject);
	}
	else
		Destroy(other.gameObject);
	this.AsteroidHealth--;
	if(AsteroidHealth <= 0)
	{
		GameObject.Find("WorldScript").GetComponent(worldGame).AddScore(scoreValue);
		Instantiate(ExplosionType, this.transform.position, Quaternion.Euler(0, 0, Random.Range(0, 360)));
		if(canSpawnChunks && chunkTypes.length > 0 && Random.Range(0, 100) < 75)
		{
			var chunkCount = Random.Range(chunkMin, chunkMax);
			if(chunkCount != 0)
			{
				for(var i : int = 0; i < chunkCount; i++)
				{
					Instantiate(chunkTypes[Random.Range(0, chunkTypes.length)], this.transform.position, Quaternion.Euler(0, 0, Random.Range(0, 360)));
				}
			}
		}
		Destroy(this.gameObject);
	}
}

function OnBecameInvisible()
{
	Destroy(this.gameObject);
}