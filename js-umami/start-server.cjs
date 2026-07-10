// Next's standalone server binds process.env.HOSTNAME; a HOSTNAME leaking in
// from the invoking shell would make it bind a non-loopback address, which is
// unreachable from the host on the WASIX stage. Pin the wildcard bind.
process.env.HOSTNAME = '0.0.0.0';
require('./.next/standalone/server.js');
