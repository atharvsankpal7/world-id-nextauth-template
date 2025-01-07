// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CertificateManager {
    struct Certificate {
        bytes32 id;
        address issuer;
        bytes32 candidateId; // World ID
        string metadataHash; // IPFS hash of certificate metadata
        uint256 issueDate;
        bool isValid;
    }

    // Mappings
    mapping(bytes32 => Certificate) public certificates;
    mapping(address => bool) public issuers;
    mapping(bytes32 => mapping(address => bool)) public accessControl;

    // Events
    event CertificateIssued(bytes32 indexed id, address indexed issuer, bytes32 indexed candidateId);
    event AccessGranted(bytes32 indexed certificateId, address indexed organization);
    event AccessRevoked(bytes32 indexed certificateId, address indexed organization);

    // Modifiers
    modifier onlyIssuer() {
        require(issuers[msg.sender], "Not authorized as issuer");
        _;
    }

    // Constructor
    constructor() {
        issuers[msg.sender] = true; // Contract deployer is the first issuer
    }

    // Functions
    function addIssuer(address issuer) external onlyIssuer {
        issuers[issuer] = true;
    }

    function issueCertificate(
        bytes32 certificateId,
        bytes32 candidateId,
        string memory metadataHash
    ) external onlyIssuer {
        require(!certificates[certificateId].isValid, "Certificate ID already exists");

        certificates[certificateId] = Certificate({
            id: certificateId,
            issuer: msg.sender,
            candidateId: candidateId,
            metadataHash: metadataHash,
            issueDate: block.timestamp,
            isValid: true
        });

        emit CertificateIssued(certificateId, msg.sender, candidateId);
    }

    function grantAccess(bytes32 certificateId, address organization) external {
        Certificate memory cert = certificates[certificateId];
        require(cert.isValid, "Certificate does not exist");
        // Only candidate can grant access
        require(keccak256(abi.encodePacked(msg.sender)) == cert.candidateId, "Not authorized");
        
        accessControl[certificateId][organization] = true;
        emit AccessGranted(certificateId, organization);
    }

    function revokeAccess(bytes32 certificateId, address organization) external {
        Certificate memory cert = certificates[certificateId];
        require(cert.isValid, "Certificate does not exist");
        require(keccak256(abi.encodePacked(msg.sender)) == cert.candidateId, "Not authorized");
        
        accessControl[certificateId][organization] = false;
        emit AccessRevoked(certificateId, organization);
    }

    function verifyCertificate(bytes32 certificateId) external view returns (bool, string memory) {
        Certificate memory cert = certificates[certificateId];
        if (!cert.isValid) {
            return (false, "");
        }
        
        // Check if viewer is issuer, candidate, or has been granted access
        bool hasAccess = issuers[msg.sender] ||
            keccak256(abi.encodePacked(msg.sender)) == cert.candidateId ||
            accessControl[certificateId][msg.sender];
            
        return (hasAccess, cert.metadataHash);
    }
}