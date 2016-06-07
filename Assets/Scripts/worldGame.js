#pragma strict

var EnemyClass : GameObject;
var asteroid : GameObject[];
var asteroidExpanded : GameObject[];
var LifeUpSound : AudioClip;
var PowerupSound : AudioClip;
var playerClass : GameObject;
var playerExplosion : GameObject;
var playerLives : int = 3;
var playerScore : int = 0;
var playerRef : GameObject;

// Powerups
var hasRapidFire : boolean = false;
var hasSpreadShot : boolean = false;
var hasFastTurn : boolean = false;
var rapidFireTime : float;
var rapidFireSeconds : int;
var fastTurnTime : float;
var fastTurnSeconds : int;
var spreadShotTime : float;
var spreadShotSeconds : int;

private var lifeScore : int = 0;
var playerDead : boolean = false;
private var playerSpawnPos : Vector3;
private var playerSpawnRotation : Quaternion;
private var gameOver : boolean = false;
private var wantsToSpawn : boolean = false;
private var canRespawn : boolean = false;
private var deathTime : float;
private var respawnDelay : int = 3;

function Start () {
	playerRef = GameObject.Find("playerShip");
	playerSpawnPos = GameObject.Find("playerShip").GetComponent(Transform).position;
	playerSpawnRotation = GameObject.Find("playerShip").GetComponent(Transform).rotation;
	GameObject.Find("LivesCount").GetComponent(UI.Text).text = playerLives.ToString();
	GameObject.Find("ScoreCount").GetComponent(UI.Text).text = playerScore.ToString();
}

function Update () {
	if(gameOver)
	{
		GameObject.Find("RapidFireActive").GetComponent(UI.Image).enabled = false;
		GameObject.Find("RapidFireTimer").GetComponent(UI.Text).enabled = false;
		GameObject.Find("SpreadShotActive").GetComponent(UI.Image).enabled = false;
		GameObject.Find("SpreadShotTimer").GetComponent(UI.Text).enabled = false;
		GameObject.Find("FastTurnActive").GetComponent(UI.Image).enabled = false;
		GameObject.Find("FastTurnTimer").GetComponent(UI.Text).enabled = false;
		GameObject.Find("GameOverDisplay").GetComponent(UI.Text).enabled = true;
		GameObject.Find("ReturnToMenuText").GetComponent(UI.Text).enabled = true;
		if(Input.GetKey("space"))
			SceneManagement.SceneManager.LoadScene("MainMenu");
	}
	else
	{
		// Update powerups here
		if(hasRapidFire)
		{
			if(Time.time - rapidFireTime >= 1.0f)
			{
				rapidFireTime = Time.time;
				rapidFireSeconds--;
				GameObject.Find("RapidFireTimer").GetComponent(UI.Text).text = rapidFireSeconds.ToString();
				if(rapidFireSeconds == 0)
				{
					hasRapidFire = false;
					GameObject.Find("RapidFireActive").GetComponent(UI.Image).enabled = false;
					GameObject.Find("RapidFireTimer").GetComponent(UI.Text).enabled = false;
				}
			}
		}
		if(hasSpreadShot)
		{
			if(Time.time - spreadShotTime >= 1.0f)
			{
				spreadShotTime = Time.time;
				spreadShotSeconds--;
				GameObject.Find("SpreadShotTimer").GetComponent(UI.Text).text = spreadShotSeconds.ToString();
				if(spreadShotSeconds == 0)
				{
					hasSpreadShot = false;
					GameObject.Find("SpreadShotActive").GetComponent(UI.Image).enabled = false;
					GameObject.Find("SpreadShotTimer").GetComponent(UI.Text).enabled = false;
				}
			}
		}
		if(hasFastTurn)
		{
			if(Time.time - fastTurnTime >= 1.0f)
			{
				fastTurnTime = Time.time;
				fastTurnSeconds--;
				GameObject.Find("FastTurnTimer").GetComponent(UI.Text).text = fastTurnSeconds.ToString();
				if(fastTurnSeconds == 0)
				{
					hasFastTurn = false;
					GameObject.Find("FastTurnActive").GetComponent(UI.Image).enabled = false;
					GameObject.Find("FastTurnTimer").GetComponent(UI.Text).enabled = false;
				}
			}
		}
		if(playerDead)
		{
			if(!canRespawn)
			{
				if(Time.time - deathTime >= 1.0)
				{
					deathTime = Time.time;
					respawnDelay--;
					GameObject.Find("RespawnCountdown").GetComponent(UI.Text).text = respawnDelay.ToString();
				}
				if(respawnDelay == 0)
				{
					canRespawn = true;
					GameObject.Find("RespawnCountdown").GetComponent(UI.Text).enabled = false;
					GameObject.Find("RespawnText").GetComponent(UI.Text).enabled = true;
				}
			}
			else
			{
				if(Input.GetKey("space") && playerDead)
				{
					wantsToSpawn = true;
				}
				if(!Input.GetKey("space") && wantsToSpawn)
				{
					GameObject.Find("RespawnText").GetComponent(UI.Text).enabled = false;
					playerDead = false;
					playerRef = Instantiate(playerClass, playerSpawnPos, playerSpawnRotation);
					wantsToSpawn = false;
					canRespawn = false;
					respawnDelay = 3;
				}
			}
		}
		if(GameObject.FindGameObjectsWithTag("Asteroid").length < 7)
		{
			var RNG : int = Random.Range(0,115);
			if(RNG <= 10)
			{
				// 0 - Top
				// 1 - Left
				// 2 - Right
				// 3 - Bottom
				var spawnSide = Random.Range(0, 4);

				if(RNG < 1 && GameObject.FindGameObjectsWithTag("Enemy").length <= 0)
				{
					switch(spawnSide)
					{
					case 0:	// Top Random.Range(135, 225)
						Instantiate(EnemyClass, Vector3(Random.Range(-5, 5), 6, 0), Quaternion.Euler(0, 0, Random.Range(135, 225)));
						break;

					case 1:	// Left Random.Range(225, 315)
						Instantiate(EnemyClass, Vector3(-10, Random.Range(-1, 1), 0), Quaternion.Euler(0, 0, Random.Range(225, 315)));
						break;

					case 2:	// Right Random.Range(45, 135)
						Instantiate(EnemyClass, Vector3(10, Random.Range(-1, 1), 0), Quaternion.Euler(0, 0, Random.Range(45, 135)));
						break;

					case 3:	// Bottom Random.Range(-45, 45)
						Instantiate(EnemyClass, Vector3(Random.Range(-5, 5), -6, 0), Quaternion.Euler(0, 0, Random.Range(-45, 45)));
						break;
					}
				}

				else if(RNG < 6)
				{
					switch(spawnSide)
					{
					case 0:	// Top Random.Range(135, 225)
						Instantiate(asteroidExpanded[Random.Range(0, asteroidExpanded.Length)], Vector3(Random.Range(-10, 10), 6, 0), Quaternion.Euler(0, 0, Random.Range(135, 225)));
						break;

					case 1:	// Left Random.Range(225, 315)
						Instantiate(asteroidExpanded[Random.Range(0, asteroidExpanded.Length)], Vector3(-10, Random.Range(-5, 5), 0), Quaternion.Euler(0, 0, Random.Range(225, 315)));
						break;

					case 2:	// Right Random.Range(45, 135)
						Instantiate(asteroidExpanded[Random.Range(0, asteroidExpanded.Length)], Vector3(10, Random.Range(-5, 5), 0), Quaternion.Euler(0, 0, Random.Range(45, 135)));
						break;

					case 3:	// Bottom Random.Range(-45, 45)
						Instantiate(asteroidExpanded[Random.Range(0, asteroidExpanded.Length)], Vector3(Random.Range(-10, 10), -6, 0), Quaternion.Euler(0, 0, Random.Range(-45, 45)));
						break;
					}
				}

				else
				{
					switch(spawnSide)
					{
					case 0:	// Top Random.Range(135, 225)
						Instantiate(asteroid[Random.Range(0, asteroid.Length)], Vector3(Random.Range(-10, 10), 6, 0), Quaternion.Euler(0, 0, Random.Range(135, 225)));
						break;

					case 1:	// Left Random.Range(225, 315)
						Instantiate(asteroid[Random.Range(0, asteroid.Length)], Vector3(-10, Random.Range(-5, 5), 0), Quaternion.Euler(0, 0, Random.Range(225, 315)));
						break;

					case 2:	// Right Random.Range(45, 135)
						Instantiate(asteroid[Random.Range(0, asteroid.Length)], Vector3(10, Random.Range(-5, 5), 0), Quaternion.Euler(0, 0, Random.Range(45, 135)));
						break;

					case 3:	// Bottom Random.Range(-45, 45)
						Instantiate(asteroid[Random.Range(0, asteroid.Length)], Vector3(Random.Range(-10, 10), -6, 0), Quaternion.Euler(0, 0, Random.Range(-45, 45)));
						break;
					}
				}
			}
		}
	}
}

function SubtractLife()
{
	playerLives--;
	playerDead = true;
	deathTime = Time.time;
	if(playerLives < 0)
	{
		gameOver = true;
	}
	else
	{
		GameObject.Find("LivesCount").GetComponent(UI.Text).text = playerLives.ToString();
		GameObject.Find("RespawnCountdown").GetComponent(UI.Text).enabled = true;
		GameObject.Find("RespawnCountdown").GetComponent(UI.Text).text = respawnDelay.ToString();
	}
}

function AddScore(score : int)
{
	playerScore += score;
	lifeScore += score;
	if(lifeScore > 10000)
	{
		lifeScore -= 10000;
		playerLives++;
		GameObject.Find("LivesCount").GetComponent(UI.Text).text = playerLives.ToString();
		AudioSource.PlayClipAtPoint(LifeUpSound, Vector3(0, 0, -11), 1.0f);
	}
	GameObject.Find("ScoreCount").GetComponent(UI.Text).text = playerScore.ToString();
}

function GetPlayerReference() : GameObject
{
	return playerRef;
}

function ActivatePowerup(powerupType : int)
{
	switch(powerupType)
	{
	case 0: // Rapid Fire
		hasRapidFire = true;
		rapidFireTime = Time.time;
		rapidFireSeconds += 20;
		GameObject.Find("RapidFireActive").GetComponent(UI.Image).enabled = true;
		GameObject.Find("RapidFireTimer").GetComponent(UI.Text).enabled = true;
		GameObject.Find("RapidFireTimer").GetComponent(UI.Text).text = rapidFireSeconds.ToString();
		AudioSource.PlayClipAtPoint(PowerupSound, Vector3(0, 0, -11), 1.0f);
		break;
	case 1: // Spread Shot
		hasSpreadShot = true;
		spreadShotTime = Time.time;
		spreadShotSeconds += 20;
		GameObject.Find("SpreadShotActive").GetComponent(UI.Image).enabled = true;
		GameObject.Find("SpreadShotTimer").GetComponent(UI.Text).enabled = true;
		GameObject.Find("SpreadShotTimer").GetComponent(UI.Text).text = spreadShotSeconds.ToString();
		AudioSource.PlayClipAtPoint(PowerupSound, Vector3(0, 0, -11), 1.0f);
		break;
	case 2: // Fast Turn
		hasFastTurn = true;
		fastTurnTime = Time.time;
		fastTurnSeconds = 30;
		GameObject.Find("FastTurnActive").GetComponent(UI.Image).enabled = true;
		GameObject.Find("FastTurnTimer").GetComponent(UI.Text).enabled = true;
		GameObject.Find("FastTurnTimer").GetComponent(UI.Text).text = fastTurnSeconds.ToString();
		AudioSource.PlayClipAtPoint(PowerupSound, Vector3(0, 0, -11), 1.0f);
		break;
	case 3: // Extra Life (handled inline
		playerLives++;
		GameObject.Find("LivesCount").GetComponent(UI.Text).text = playerLives.ToString();
		AudioSource.PlayClipAtPoint(LifeUpSound, Vector3(0, 0, -11), 1.0f);
		break;
	}
}
