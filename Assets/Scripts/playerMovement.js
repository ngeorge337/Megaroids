#pragma strict

var speed : float = 0.045;
var turnSpeed : float = 208;
var laserType : GameObject;
var laserSounds : AudioClip[];
var rapidTime : float;
var rapidDelay : float = 0.15f;

private var shotLaser : boolean = false;

function Start () {

}

function Update ()
{
	if(Input.GetKey("up"))
	{
		this.transform.position += this.transform.up * speed;
	}
	//else if(Input.GetKey("down"))
	//{
	//	this.transform.position -= this.transform.up * speed;
	//}
	if(Input.GetKey("left"))
	{
		if(GameObject.Find("WorldScript").GetComponent(worldGame).hasFastTurn)
			transform.Rotate(Vector3(0, 0, 1) * Time.deltaTime * (turnSpeed * 1.5));
		else
			transform.Rotate(Vector3(0, 0, 1) * Time.deltaTime * turnSpeed);
	}
	else if(Input.GetKey("right"))
	{
		if(GameObject.Find("WorldScript").GetComponent(worldGame).hasFastTurn)
			transform.Rotate(Vector3(0, 0, -1) * Time.deltaTime * (turnSpeed * 1.5));
		else
			transform.Rotate(Vector3(0, 0, -1) * Time.deltaTime * turnSpeed);
	}

	if(Input.GetKey("space"))
	{
		if(GameObject.Find("WorldScript").GetComponent(worldGame).hasRapidFire)
		{
			if(Time.time - rapidTime >= rapidDelay)
			{
				rapidTime = Time.time;
				if(GameObject.Find("WorldScript").GetComponent(worldGame).hasSpreadShot)
				{
					Instantiate(laserType, this.transform.position + (this.transform.up * 0.85), Quaternion.LookRotation(this.transform.forward, this.transform.up + (this.transform.right * 0.5)));
					Instantiate(laserType, this.transform.position + (this.transform.up * 0.85), Quaternion.LookRotation(this.transform.forward, this.transform.up - (this.transform.right * 0.5)));
					Instantiate(laserType, this.transform.position + (this.transform.up * 0.85), this.transform.rotation);
					//shotLaser = true;
					AudioSource.PlayClipAtPoint(laserSounds[Random.Range(0, laserSounds.Length)], Vector3(0, 0, -11), 1.0f);
				}
				else
				{
					Instantiate(laserType, this.transform.position + (this.transform.up * 0.85), this.transform.rotation);
					AudioSource.PlayClipAtPoint(laserSounds[Random.Range(0, laserSounds.Length)], Vector3(0, 0, -11), 1.0f);
				}
			}
		}
		else if(!shotLaser)
		{
			if(GameObject.Find("WorldScript").GetComponent(worldGame).hasSpreadShot)
			{
				if((GameObject.FindGameObjectsWithTag("PlayerLaser").length / 3) < 3)
				{
					Instantiate(laserType, this.transform.position + (this.transform.up * 0.85), Quaternion.LookRotation(this.transform.forward, this.transform.up + (this.transform.right * 0.5)));
					Instantiate(laserType, this.transform.position + (this.transform.up * 0.85), Quaternion.LookRotation(this.transform.forward, this.transform.up - (this.transform.right * 0.5)));
					Instantiate(laserType, this.transform.position + (this.transform.up * 0.85), this.transform.rotation);
					shotLaser = true;
					AudioSource.PlayClipAtPoint(laserSounds[Random.Range(0, laserSounds.Length)], Vector3(0, 0, -11), 1.0f);
				}
			}
			else if(GameObject.FindGameObjectsWithTag("PlayerLaser").length < 3)
			{
				Instantiate(laserType, this.transform.position + (this.transform.up * 0.85), this.transform.rotation);
				shotLaser = true;
				AudioSource.PlayClipAtPoint(laserSounds[Random.Range(0, laserSounds.Length)], Vector3(0, 0, -11), 1.0f);
			}
		}
	}
	else if(!Input.GetKey("space"))
		shotLaser = false;

	// Wrap position when going off-screen
	if(this.transform.position.x < -10.5)
	{
		//wrapX = true;
		this.transform.position.x = 10.5;
	}
	if(this.transform.position.x > 10.5)
	{
		//wrapX = true;
		this.transform.position.x = -10.5;
	}
	if(this.transform.position.y < -5.5)
	{
		//wrapY = true;
		this.transform.position.y = 5.5;
	}
	if(this.transform.position.y > 5.5)
	{
		//wrapY = true;
		this.transform.position.y = -5.5;
	}
}