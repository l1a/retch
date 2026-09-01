# COPR invokes this as: make -f .copr/Makefile srpm outdir=<dir>
#
# Why make_srpm rather than COPR's `rpkg` source type: this spec's Source0 is a remote
# tag tarball, and make_srpm makes the fetch explicit and reproducible instead of relying
# on rpkg's handling of remote sources. It is also exactly the sequence verified by hand
# in a fedora container before the spec was ever committed, so a COPR failure here and a
# local failure have the same cause.
#
# NOTE: this builds whatever version packaging/copr/retch.spec pins, which tracks the
# last RELEASED tag -- not the current Cargo.toml. That is deliberate; see NOTES.md.

.PHONY: srpm

srpm:
	dnf -y install rpm-build rpmdevtools
	rpmdev-setuptree
	cp packaging/copr/retch.spec $(HOME)/rpmbuild/SPECS/
	spectool -g -R $(HOME)/rpmbuild/SPECS/retch.spec
	rpmbuild -bs $(HOME)/rpmbuild/SPECS/retch.spec
	cp $(HOME)/rpmbuild/SRPMS/*.src.rpm $(outdir)
