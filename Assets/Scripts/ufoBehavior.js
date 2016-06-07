#pragma strict

// In Unity2D
// Angle.Right (Z) = TOWARDS THE SCREEN
// Angle.Up (Y) = Upwards on screen
// Angle.Forward (X) = Horizontal

var scoreValue : int = 1000;
var ExplosionType : GameObject;
var health : int = 5;
var moveSpeed : float = 0.009;
var laserType : GameObject;
var laserSounds : AudioClip[];
var powerUpDrops : GameObject[];
private var shootAng : Vector3;
private var shootTime : float;
private var angleTime : float;
private var moveUpdateTime : float = 0.85f;
private var moveDirection : Vector3;
private var initialMoveDir : Vector3;
private var dirDelta : float = 0.0f;
private var zigzag : boolean = false;
private var curveLeft : boolean = false;
private var flipRotation : boolean;
private var movementType : int;

function Start () {
	if(Random.Range(0, 10) < 5)
		flipRotation = true;
	if(Random.Range(0, 10) < 5)
		curveLeft = true;
	shootTime = Time.time;
	angleTime = Time.time;
	moveDirection = this.transform.up;
	movementType = Random.Range(0, 3);
	initialMoveDir = moveDirection;
	if(movementType == 1)
		moveUpdateTime = 0.1f;
	else if(movementType == 2)
	{
		if(Random.Range(0, 10) < 5)
		{
			moveDirection = initialMoveDir + initialMoveDir.up;
			zigzag = true;
		}
		else
			moveDirection = initialMoveDir + -initialMoveDir.up;
	}
}

function Update ()
{
	this.transform.position += moveDirection * moveSpeed;
	if(flipRotation)
		this.transform.Rotate(Vector3(0, 0, -1) * 0.6);
	else
		this.transform.Rotate(Vector3(0, 0, 1) * 0.6);
	if(Time.time - shootTime >= 3.5)
	{
		shootTime = Time.time;
		if(!GameObject.Find("WorldScript").GetComponent(worldGame).playerDead)
		{
			shootAng = (GameObject.Find("WorldScript").GetComponent(worldGame).GetPlayerReference().GetComponent(Transform).position - this.transform.position).normalized;
			Instantiate(laserType, this.transform.position + (shootAng * 0.85), Quaternion.LookRotation(this.transform.forward, shootAng));
			AudioSource.PlayClipAtPoint(laserSounds[Random.Range(0, laserSounds.Length)], Vector3(0, 0, -11), 1.0f);
		}
	}

	if(Time.time - angleTime >= moveUpdateTime)
	{
		angleTime = Time.time;
		switch(movementType)
		{
		case 0:	// Straight movement -- no changes in angle
			break;
		case 1: // Curved movement
			dirDelta += 0.01;
			if(dirDelta > 1.0f)
				dirDelta = 1.0f;
			if(curveLeft)
				moveDirection = Vector3.Lerp(initialMoveDir, -initialMoveDir.up, dirDelta);
			else
				moveDirection = Vector3.Lerp(initialMoveDir, initialMoveDir.up, dirDelta);
			break;
		case 2: // zig-zag
			if(zigzag)
				moveDirection = initialMoveDir + -initialMoveDir.up;
			else
				moveDirection = initialMoveDir + initialMoveDir.up;
			zigzag = !zigzag;
			break;
		}
	}
}

function OnTriggerEnter2D(other : Collider2D)
{
	if(other.tag == "PlayerLaser")
	{
		other.gameObject.GetComponent(Animator).SetBool("Impact", true);
		other.gameObject.transform.rotation = Quaternion.Euler(0, 0, Random.Range(0, 360));
		this.health--;

		if(health == 0)
		{
			GameObject.Find("WorldScript").GetComponent(worldGame).AddScore(scoreValue);
			Instantiate(ExplosionType, this.transform.position, Quaternion.Euler(0, 0, Random.Range(0, 360)));
			var launchAngle : Vector3 = (GameObject.Find("WorldScript").GetComponent(worldGame).GetPlayerReference().GetComponent(Transform).position - this.transform.position).normalized;
			Instantiate(powerUpDrops[Random.Range(0, powerUpDrops.Length)], this.transform.position, Quaternion.LookRotation(this.transform.forward, launchAngle));
			Destroy(this.gameObject);
		}
	}
	else if(other.tag == "Player")
	{
		Instantiate(GameObject.Find("WorldScript").GetComponent(worldGame).playerExplosion, other.gameObject.transform.position, Quaternion.Euler(0, 0, Random.Range(0, 360)));
		GameObject.Find("WorldScript").GetComponent(worldGame).SubtractLife();
		Destroy(other.gameObject);
		this.health--;
		if(health == 0)
		{
			GameObject.Find("WorldScript").GetComponent(worldGame).AddScore(scoreValue);
			Instantiate(ExplosionType, this.transform.position, Quaternion.Euler(0, 0, Random.Range(0, 360)));
			Destroy(this.gameObject);
		}
	}
}