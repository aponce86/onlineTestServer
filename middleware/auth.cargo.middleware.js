module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ msg: 'Must provide a basic authorization token' });

  let email;
  let password;

  try {
      const buff = Buffer.from(auth.replace('Basic ', ''), 'base64');
      const credentials = buff.toString('utf-8');
      email = credentials.split(':')[0];
      password = credentials.split(':')[1];
      if (email == undefined || password == undefined) throw new Error();
  } catch (error) {
      return res.status(401).json({ msg: 'Malformed basic authorization token' });
  }

  if(email != 'robiel871013@gmail.com' || password != 'WcRbT#13') { return res.status(401).json({msg: 'Invalid credentials'}) }

  next();

}