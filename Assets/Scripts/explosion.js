#pragma strict

var destroyNow : boolean = false;
var explosionSounds : AudioClip[];

function Start () {
	AudioSource.PlayClipAtPoint(explosionSounds[Random.Range(0, explosionSounds.Length)], Vector3(0, 0, -11), 0.2f);
}

function Update () {
	if(destroyNow)
		Destroy(this.gameObject);
}

function OnBecameInvisible()
{
	Destroy(this.gameObject);
}